import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'start');
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(argument => argument !== '--check')) throw new Error('用法：node tools/build-start.mjs [--check]');
const ids = ['purpose', 'domain', 'build', 'deploy', 'indexing', 'on-page', 'traffic', 'revenue'];
const fail = message => { throw new Error(`上站路线数据：${message}`); };
const html = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
function text(value, field, allowEmpty = false) {
  if (typeof value !== 'string' || (!allowEmpty && !value.trim())) fail(`${field} 必须为${allowEmpty ? '' : '非空'}字符串`);
}
function object(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${field} 必须为对象`);
}
function date(value, field, allowEmpty = false) {
  text(value, field, allowEmpty);
  if (allowEmpty && value === '') return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(`${value}T00:00:00Z`)) || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) fail(`${field} 必须为有效的 YYYY-MM-DD 日期`);
}
function link(value, field) {
  text(value, field);
  if (/[\s<>"'\\]/u.test(value)) fail(`${field} 包含无效字符`);
  let url;
  try { url = new URL(value, 'https://local.invalid/start/'); } catch { fail(`${field} 不是合法链接`); }
  if (value.startsWith('https://')) {
    if (!url.hostname || url.username || url.password) fail(`${field} 必须为合法 HTTPS 链接`);
    return;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('/')) fail(`${field} 必须为 HTTPS 或站内相对链接`);
  // Relative links are authored from start/, and must stay inside this repository.
  let depth = 1;
  for (const segment of value.split(/[?#]/)[0].split('/')) {
    if (segment === '..') depth -= 1;
    else if (segment && segment !== '.') depth += 1;
    if (depth < 0 || /%2f|%5c|%2e/i.test(segment)) fail(`${field} 必须留在本站目录内`);
  }
}
function array(value, field, nonempty = false) {
  if (!Array.isArray(value) || (nonempty && !value.length)) fail(`${field} 必须为${nonempty ? '非空' : ''}数组`);
}
function validate(data) {
  object(data, '顶层');
  date(data.updated, 'updated');
  array(data.stages, 'stages', true);
  if (data.stages.length !== ids.length) fail('必须包含约定的八个阶段');
  const seen = new Set();
  data.stages.forEach((stage, index) => {
    object(stage, `stages[${index}]`);
    for (const field of ['id', 'title', 'summary', 'goal', 'done', 'route', 'nextTip']) text(stage[field], `stages[${index}].${field}`);
    if (seen.has(stage.id) || stage.id !== ids[index]) fail(`阶段 ID 重复、未知或顺序不正确：${stage.id}`);
    seen.add(stage.id);
    array(stage.steps, `${stage.id}.steps`, true);
    stage.steps.forEach((step, offset) => {
      object(step, `${stage.id}.steps[${offset}]`);
      for (const field of ['title', 'action', 'check', 'pitfall']) text(step[field], `${stage.id}.steps[${offset}].${field}`);
    });
    array(stage.tools, `${stage.id}.tools`);
    stage.tools.forEach((tool, offset) => {
      object(tool, `${stage.id}.tools[${offset}]`);
      for (const field of ['name', 'description']) text(tool[field], `${stage.id}.tools[${offset}].${field}`);
      link(tool.url, `${stage.id}.tools[${offset}].url`);
      if (typeof tool.primary !== 'boolean') fail(`${stage.id}.tools[${offset}].primary 必须为布尔值`);
    });
    array(stage.references, `${stage.id}.references`);
    stage.references.forEach((reference, offset) => {
      object(reference, `${stage.id}.references[${offset}]`);
      for (const field of ['title', 'author', 'platform']) text(reference[field], `${stage.id}.references[${offset}].${field}`);
      link(reference.url, `${stage.id}.references[${offset}].url`);
      date(reference.date, `${stage.id}.references[${offset}].date`, true);
      if (reference.source_key !== undefined) {
        text(reference.source_key, `${stage.id}.references[${offset}].source_key`);
        if (!/^[a-z][a-z0-9-]*:[a-z0-9]+$/.test(reference.source_key)) fail(`${stage.id}.references[${offset}].source_key 必须为资料源短键`);
      }
    });
  });
}
function anchor(url, title, nested = false) {
  const external = url.startsWith('https://');
  const href = external || !nested ? url : `../${url}`;
  return `<a href="${html(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${html(title)}</a>`;
}
function render(template, values) {
  const rendered = template.replace(/\{\{([A-Z_]+)\}\}/g, (marker, key) => {
    if (!(key in values)) fail(`模板使用未知标记 ${marker}`);
    return values[key];
  });
  if (/\{\{.*?\}\}/.test(rendered)) fail('模板含未替换标记');
  for (const key of Object.keys(values)) if (!template.includes(`{{${key}}}`)) fail(`模板缺少标记 ${key}`);
  return rendered;
}
function toolsTable(tools) {
  if (!tools.length) return '<tbody><tr><td>本阶段暂无工具入口</td><td></td><td></td><td></td></tr></tbody>';
  const entries = [...tools.filter(tool => tool.primary), ...tools.filter(tool => !tool.primary)];
  const rows = [];
  for (let offset = 0; offset < entries.length; offset += 4) {
    const cells = Array.from({ length: 4 }, (_, column) => {
      const tool = entries[offset + column];
      return tool ? `<td><span class="tool-priority${tool.primary ? ' primary' : ''}">${tool.primary ? '先从这里开始' : '按需使用'}</span>${anchor(tool.url, tool.name, true)}<p class="tool-description">${html(tool.description)}</p></td>` : '<td></td>';
    }).join('');
    rows.push(`<tr>${cells}</tr>`);
  }
  return `<tbody>${rows.join('\n        ')}</tbody>`;
}
function sourcesTable(references) {
  if (!references.length) return '<tr><td>本阶段暂无参考原文</td></tr>';
  return references.map(reference => `<tr><td>${anchor(reference.url, reference.title, true)}<p class="source-meta">${html(reference.author)} · ${html(reference.platform)} · ${reference.date ? `<time datetime="${html(reference.date)}">${html(reference.date)}</time>` : '以官网更新为准'}</p></td></tr>`).join('\n        ');
}

function stageRows(stages, offset) {
  return stages.map((stage, index) => `<tr><th scope="row">${String(index + offset + 1).padStart(2, '0')}<br><a class="category-link" href="./${html(stage.id)}/">${html(stage.title)}</a></th><td>${html(stage.goal)}<p class="route-summary">${html(stage.summary)}</p></td><td>${html(stage.done)}</td><td>${anchor(`./${stage.id}/`, '进入阶段')}</td></tr>`).join('\n        ');
}

const data = JSON.parse(await readFile(path.join(directory, 'guide.json'), 'utf8'));
validate(data);
const [indexTemplate, stageTemplate] = await Promise.all(['index.template.html', 'stage.template.html'].map(filename => readFile(path.join(directory, filename), 'utf8')));
const updated = { UPDATED: html(data.updated), UPDATED_DISPLAY: html(data.updated.replace(/-/g, '.')) };
const outputs = new Map();
outputs.set('index.html', render(indexTemplate, {
  ...updated,
  FIRST_SITE_ROWS: stageRows(data.stages.slice(0, 5), 0),
  GROWTH_ROWS: stageRows(data.stages.slice(5), 5),
}));
data.stages.forEach((stage, index) => {
  const previous = data.stages[index - 1];
  const next = data.stages[index + 1];
  outputs.set(`${stage.id}/index.html`, render(stageTemplate, {
    ...updated,
    TITLE: html(stage.title), SUMMARY: html(stage.summary), STAGE_NUMBER: String(index + 1).padStart(2, '0'),
    GOAL: html(stage.goal), ROUTE: html(stage.route), DONE: html(stage.done), NEXT_TIP: html(stage.nextTip),
    STEP_ROWS: stage.steps.map((step, offset) => `<tr><th scope="row">${String(offset + 1).padStart(2, '0')} · ${html(step.title)}</th><td>${html(step.action)}</td><td>${html(step.check)}</td><td>${html(step.pitfall)}</td></tr>`).join('\n        '),
    TOOL_ROWS: toolsTable(stage.tools), SOURCE_ROWS: sourcesTable(stage.references),
    STAGE_NAVIGATION: [previous ? anchor(`../${previous.id}/`, `← ${previous.title}`) : '', anchor('../', '路线总览'), next ? anchor(`../${next.id}/`, `${next.title} →`) : anchor('../../', '返回 S 计划')].filter(Boolean).join('\n      '),
  }));
});
// Check all destinations before writing anything; --check never creates directories or files.
if (check) {
  const problems = [];
  for (const [filename, contents] of outputs) {
    let current;
    try { current = await readFile(path.join(directory, filename), 'utf8'); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      problems.push(`缺少 start/${filename}`);
      continue;
    }
    if (current !== contents) problems.push(`start/${filename} 与数据或模板不一致`);
  }
  if (problems.length) throw new Error(`${problems.join('\n')}\n请先运行 node tools/build-start.mjs`);
} else {
  for (const [filename, contents] of outputs) {
    const destination = path.join(directory, filename);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, contents, 'utf8');
  }
}
console.log(`${check ? '校验通过' : '已生成'}：8 个阶段，start/index.html 与 8 个阶段页面`);
