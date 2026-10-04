import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'start');
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(argument => argument !== '--check')) throw new Error('用法：node tools/build-start.mjs [--check]');
const practiceIds = ['first-site', 'ranking', 'expansion', 'product'];
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
function references(value, field) {
  array(value, field);
  value.forEach((reference, offset) => {
    const prefix = `${field}[${offset}]`;
    object(reference, prefix);
    for (const key of ['title', 'author', 'platform']) text(reference[key], `${prefix}.${key}`);
    link(reference.url, `${prefix}.url`);
    date(reference.date, `${prefix}.date`, true);
    if (reference.source_key !== undefined) {
      text(reference.source_key, `${prefix}.source_key`);
      if (!/^[a-z][a-z0-9-]*:[a-z0-9]+$/.test(reference.source_key)) fail(`${prefix}.source_key 必须为资料源短键`);
    }
  });
}
function validatePractices(data) {
  object(data, '练习数据');
  date(data.updated, '练习.updated');
  references(data.basis, 'basis');
  array(data.levels, 'levels', true);
  if (data.levels.length !== practiceIds.length) fail('必须包含约定的四种练习');
  data.levels.forEach((level, index) => {
    const prefix = `levels[${index}]`;
    object(level, prefix);
    for (const key of ['id', 'title', 'alias', 'summary', 'entry', 'focus', 'defer', 'route', 'goal', 'skills', 'artifacts']) text(level[key], `${prefix}.${key}`);
    if (level.id !== practiceIds[index]) fail(`练习 ID 重复、未知或顺序不正确：${level.id}`);
    array(level.steps, `${prefix}.steps`, true);
    level.steps.forEach((step, offset) => {
      object(step, `${prefix}.steps[${offset}]`);
      for (const key of ['title', 'action', 'check', 'pitfall']) text(step[key], `${prefix}.steps[${offset}].${key}`);
    });
    array(level.modules, `${prefix}.modules`, true);
    const modules = new Set();
    level.modules.forEach((module, offset) => {
      object(module, `${prefix}.modules[${offset}]`);
      text(module.description, `${prefix}.modules[${offset}].description`);
      if (!ids.includes(module.id) || modules.has(module.id)) fail(`${level.id} 引用重复或未知的环节：${module.id}`);
      modules.add(module.id);
    });
    references(level.references, `${prefix}.references`);
  });
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
    references(stage.references, `${stage.id}.references`);
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
  return stages.map((stage, index) => `<tr><th scope="row">${String(index + offset + 1).padStart(2, '0')}<br><a class="category-link" href="../${html(stage.id)}/">${html(stage.title)}</a></th><td>${html(stage.goal)}<p class="route-summary">${html(stage.summary)}</p></td><td>${html(stage.done)}</td><td>${anchor(`../${stage.id}/`, '查看环节')}</td></tr>`).join('\n        ');
}

const data = JSON.parse(await readFile(path.join(directory, 'guide.json'), 'utf8'));
validate(data);
const practices = JSON.parse(await readFile(path.join(directory, 'practice.json'), 'utf8'));
validatePractices(practices);
const [indexTemplate, stageTemplate, workflowTemplate, practiceTemplate] = await Promise.all(['index.template.html', 'stage.template.html', 'workflow.template.html', 'practice.template.html'].map(filename => readFile(path.join(directory, filename), 'utf8')));
const updated = { UPDATED: html(data.updated), UPDATED_DISPLAY: html(data.updated.replace(/-/g, '.')) };
const outputs = new Map();
outputs.set('workflow/index.html', render(workflowTemplate, {
  ...updated,
  FIRST_SITE_ROWS: stageRows(data.stages.slice(0, 5), 0),
  GROWTH_ROWS: stageRows(data.stages.slice(5), 5),
}));
const practiceUpdated = { UPDATED: html(practices.updated), UPDATED_DISPLAY: html(practices.updated.replace(/-/g, '.')) };
const practiceReferences = practices.basis;
outputs.set('index.html', render(indexTemplate, {
  ...practiceUpdated,
  PRACTICE_ROWS: practices.levels.map(level => `<tr><th scope="row"><span class="practice-alias">${html(level.alias)}</span><br>${anchor(`./${level.id}/`, level.title)}</th><td>${html(level.entry)}</td><td><strong class="scope-label">本轮做：</strong>${html(level.focus)}<p class="route-summary"><strong>先放：</strong>${html(level.defer)}</p></td><td>${html(level.goal)}</td><td>${html(level.skills)}</td><td>${html(level.artifacts)}</td></tr>`).join('\n        '),
  PRACTICE_SOURCES: sourcesTable(practiceReferences),
}));
practices.levels.forEach((level, index) => {
  const previous = practices.levels[index - 1];
  const next = practices.levels[index + 1];
  outputs.set(`${level.id}/index.html`, render(practiceTemplate, {
    ...practiceUpdated,
    TITLE: html(level.title), ALIAS: html(level.alias), SUMMARY: html(level.summary), ENTRY: html(level.entry),
    FOCUS: html(level.focus), GOAL: html(level.goal), SKILLS: html(level.skills), ROUTE: html(level.route), DEFER: html(level.defer), ARTIFACTS: html(level.artifacts),
    STEP_ROWS: level.steps.map((step, offset) => `<tr><th scope="row">${String(offset + 1).padStart(2, '0')} · ${html(step.title)}</th><td>${html(step.action)}</td><td>${html(step.check)}</td><td>${html(step.pitfall)}</td></tr>`).join('\n        '),
    MODULE_ROWS: level.modules.map(module => `<tr><th scope="row">${anchor(`../${module.id}/`, data.stages.find(stage => stage.id === module.id).title)}</th><td>${html(module.description)}</td></tr>`).join('\n        '),
    SOURCE_ROWS: sourcesTable(level.references),
    PRACTICE_NAVIGATION: [previous ? anchor(`../${previous.id}/`, `← ${previous.title}`) : '', anchor('../', '按能力重新选练习'), next ? anchor(`../${next.id}/`, `${next.title} →`) : anchor('../workflow/', '查通用环节手册')].filter(Boolean).join('\n      '),
  }));
});
const practiceText = ['# 上站练习路线（个人自用 · 出海 SaaS 工具站）', '', '背景：独立开发者，会用 AI 做网页，SEO 与上站经验不足；主线是出海 SaaS 工具站。', '用途：掌握上站流程与对应能力，按尚未掌握的能力选练习，可在已有站补练。', '本轮做什么是本次执行范围；先放什么表示暂时不投入，不代表永远不做。', '目标是网站或项目达到的状态；能力是能独立完成的动作与判断；证据和产出物由本人在站外人工处理，页面只列预期材料。', '正式 SaaS 的需求验证可并行开始；同主题可在已有站补练，无关需求先评估站点边界。账号/限额/计费按实际验证需要引入。各层为本站整理，不称原作者统一标准。', ''].join('\n') + practices.levels.map(level => [
  `## ${level.alias} · ${level.title}`, `现在你的特征：${level.entry}`, `本轮做什么：${level.focus}`, `先放什么：${level.defer}`, `目标：${level.goal}`, `补齐的能力点：${level.skills}`, `本轮证据和产出物：${level.artifacts}`, `本轮路线：${level.route}`, '',
  '本轮动作：', ...level.steps.map((step, index) => `${index + 1}. ${step.title}\n   做什么：${step.action}\n   留下什么：${step.check}\n   注意：${step.pitfall}`), '',
  '原文与官方资料：', ...level.references.map(reference => `- ${reference.title} | ${reference.author} | ${reference.platform} | ${reference.date || '以官网更新为准'} | ${reference.url}`), '',
].join('\n')).join('\n');
outputs.set('practice.md', `${practiceText}\n`);
data.stages.forEach((stage, index) => {
  const previous = data.stages[index - 1];
  const next = data.stages[index + 1];
  outputs.set(`${stage.id}/index.html`, render(stageTemplate, {
    ...updated,
    TITLE: html(stage.title), SUMMARY: html(stage.summary), STAGE_NUMBER: String(index + 1).padStart(2, '0'),
    GOAL: html(stage.goal), ROUTE: html(stage.route), DONE: html(stage.done), NEXT_TIP: html(stage.nextTip),
    STEP_ROWS: stage.steps.map((step, offset) => `<tr><th scope="row">${String(offset + 1).padStart(2, '0')} · ${html(step.title)}</th><td>${html(step.action)}</td><td>${html(step.check)}</td><td>${html(step.pitfall)}</td></tr>`).join('\n        '),
    TOOL_ROWS: toolsTable(stage.tools), SOURCE_ROWS: sourcesTable(stage.references),
    STAGE_NAVIGATION: [previous ? anchor(`../${previous.id}/`, `← ${previous.title}`) : '', anchor('../workflow/', '环节手册'), next ? anchor(`../${next.id}/`, `${next.title} →`) : anchor('../../', '返回 S 计划')].filter(Boolean).join('\n      '),
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
console.log(`${check ? '校验通过' : '已生成'}：4 种练习、8 个环节，共 14 个路线页面与文字版`);
