import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'discover');
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(argument => argument !== '--check')) throw new Error('用法：node tools/build-discover.mjs [--check]');
const fail = message => { throw new Error(`产品发现数据：${message}`); };
const text = (value, field, allowEmpty = false) => {
  if (typeof value !== 'string' || (!allowEmpty && !value.trim())) fail(`${field} 必须为${allowEmpty ? '' : '非空'}字符串`);
  return value;
};
const slug = (value, field) => {
  text(value, field);
  if (!/^[a-z][a-z0-9-]*$/.test(value)) fail(`${field} 必须为小写英文短标识`);
};
const html = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const md = value => String(value).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\[/g, '\\[').replace(/\]/g, '\\]');

function validate(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) fail('顶层必须为对象');
  text(data.updated, 'updated');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.updated) || !Number.isFinite(Date.parse(`${data.updated}T00:00:00Z`)) || new Date(`${data.updated}T00:00:00Z`).toISOString().slice(0, 10) !== data.updated) fail('updated 必须为有效的 YYYY-MM-DD 日期');
  if (!Array.isArray(data.groups) || !data.groups.length) fail('groups 必须为非空数组');
  if (!Array.isArray(data.sites) || !data.sites.length) fail('sites 必须为非空数组');
  const groups = new Set();
  const expectedGroups = new Set(['methods', 'directories', 'launch', 'signals', 'apps', 'marketplaces']);
  for (const group of data.groups) {
    if (!group || typeof group !== 'object') fail('group 必须为对象');
    slug(group.id, 'group.id');
    if (groups.has(group.id) || !expectedGroups.has(group.id)) fail(`重复或未知分组 ${group.id}`);
    groups.add(group.id);
    text(group.label, `${group.id}.label`);
    text(group.description, `${group.id}.description`);
  }
  if (groups.size !== expectedGroups.size) fail('必须包含约定的六个分组');
  const ids = new Set();
  const urls = new Set();
  for (const site of data.sites) {
    if (!site || typeof site !== 'object') fail('site 必须为对象');
    slug(site.id, 'site.id');
    if (ids.has(site.id)) fail(`重复入口 ID ${site.id}`);
    ids.add(site.id);
    for (const field of ['name', 'group', 'summary', 'observe']) text(site[field], `${site.id}.${field}`);
    text(site.note, `${site.id}.note`, true);
    if (site.source_key !== undefined) {
      text(site.source_key, `${site.id}.source_key`);
      if (!/^[a-z][a-z0-9-]*:[a-z0-9]+$/.test(site.source_key)) fail(`${site.id}.source_key 必须为资料源短键`);
    }
    if (!groups.has(site.group)) fail(`${site.id} 使用未知分组`);
    if (typeof site.featured !== 'boolean') fail(`${site.id}.featured 必须为布尔值`);
    if (site.featured !== (site.id === 'toolify')) fail('只有 Toolify 必须且可以 featured');
    if (site.url === null) {
      if (site.name !== 'All Things AI') fail('只有 All Things AI 可标为官网待核');
    } else {
      text(site.url, `${site.id}.url`);
      let url;
      try { url = new URL(site.url); } catch { fail(`${site.id} URL 无效`); }
      if (url.protocol !== 'https:' || !url.hostname || url.username || url.password || /[\s<>"\\]/u.test(site.url)) fail(`${site.id} URL 必须为合法 HTTPS 地址`);
      const key = url.href.replace(/\/$/, '');
      if (urls.has(key)) fail(`重复 URL ${site.url}`);
      urls.add(key);
    }
  }
  if (!ids.has('toolify')) fail('缺少 Toolify 阅读起点');
}

function renderEntry(site) {
  const link = site.url === null
    ? `<span class="site-unverified">${html(site.name)} <small>官网待核</small></span>`
    : `<a href="${html(site.url)}" target="_blank" rel="noopener noreferrer">${html(site.name)}</a>`;
  return `<td class="site-entry" id="${html(site.id)}" data-group="${html(site.group)}" title="${html(site.observe)}">${link}<p class="site-summary">${html(site.summary)}</p>${site.note ? `<p class="site-note">${html(site.note)}</p>` : ''}</td>`;
}

function renderGroup(group, sites) {
  const rows = [];
  for (let offset = 0; offset < sites.length; offset += 4) {
    const heading = offset === 0 ? `<th scope="rowgroup" rowspan="${Math.ceil(sites.length / 4)}" title="${html(group.description)}">${html(group.label)}</th>` : '';
    const cells = Array.from({ length: 4 }, (_, column) => sites[offset + column] ? renderEntry(sites[offset + column]) : '<td></td>').join('');
    rows.push(`<tr>${heading}${cells}</tr>`);
  }
  return `<tbody data-group="${html(group.id)}" data-label="${html(group.label)}" data-description="${html(group.description)}">${rows.join('\n          ')}</tbody>`;
}

const data = JSON.parse(await readFile(path.join(directory, 'sites.json'), 'utf8'));
validate(data);
// Keep each group's editorial order while using the group order as the directory's reading order.
const orderedSites = data.groups.flatMap(group => data.sites.filter(site => site.group === group.id));
const counts = new Map(data.groups.map(group => [group.id, data.sites.filter(site => site.group === group.id).length]));
const values = {
  SITE_COUNT: String(data.sites.length),
  GROUP_COUNT: String(data.groups.length),
  UPDATED: html(data.updated),
  UPDATED_DISPLAY: html(data.updated.replace(/-/g, '.')),
  TABLE_BODY: data.groups.map(group => renderGroup(group, orderedSites.filter(site => site.group === group.id))).join('\n        '),
};
const template = await readFile(path.join(directory, 'index.template.html'), 'utf8');
const rendered = template.replace(/\{\{([A-Z_]+)\}\}/g, (marker, key) => {
  if (!(key in values)) fail(`模板使用未知标记 ${marker}`);
  return values[key];
});
if (/\{\{.*?\}\}/.test(rendered)) fail('模板含未替换标记');
for (const key of Object.keys(values)) if (!template.includes(`{{${key}}}`)) fail(`模板缺少标记 ${key}`);

const sourceKeys = [...new Set(orderedSites.map(site => site.source_key).filter(Boolean))];
const sourceHeader = sourceKeys.length ? `---\nsources: [${sourceKeys.join(', ')}]\n---\n\n` : '';
let markdown = `${sourceHeader}# 翻石地图 · 网站入口清单\n\n> “翻石头最多的人，赢得游戏。”——彼得·林奇\n\n译自 [PBS FRONTLINE 访谈](https://www.pbs.org/wgbh/pages/frontline/shows/betting/pros/lynch.html)。\n\n更新日期：${data.updated} · ${data.sites.length} 个入口 · ${data.groups.length} 个观察角度\n\n从类目理解用户，从产品认识生意。先读调研方法，再从 Toolify 开始形成全貌，其他入口作为后续观察候选。\n\n流量和排名只能提供线索，不能直接证明真实收入、付费意愿或商业需求。未核实官网的入口保留待核状态；本清单不继承第三方的名次、推荐或评分。\n`;
for (const group of data.groups) {
  markdown += `\n## ${md(group.label)}（${counts.get(group.id)}）\n\n${md(group.description)}\n\n| 名称 | 入口 | 用途 | 观察重点 | 说明 |\n|---|---|---|---|---|\n`;
  for (const site of orderedSites.filter(item => item.group === group.id)) {
    const entry = site.url === null ? '官网待核' : `[访问网站](<${site.url}>)`;
    const note = [site.featured ? '当前阅读起点' : '', site.note].filter(Boolean).join('；');
    markdown += `| ${md(site.name)} | ${entry} | ${md(site.summary)} | ${md(site.observe)} | ${md(note)} |\n`;
  }
}

for (const [filename, contents] of [['index.html', rendered], ['sites.md', markdown]]) {
  const destination = path.join(directory, filename);
  if (check) {
    let current;
    try { current = await readFile(destination, 'utf8'); } catch { throw new Error(`缺少 ${filename}，请先运行生成命令`); }
    if (current !== contents) throw new Error(`${filename} 与数据或模板不一致，请重新生成`);
  } else {
    await writeFile(destination, contents, 'utf8');
  }
}
console.log(`${check ? '校验通过' : '已生成'}：${data.sites.length} 个入口，discover/index.html 与 discover/sites.md`);
