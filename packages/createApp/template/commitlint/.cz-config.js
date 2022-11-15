'use strict';

module.exports = {
    types: [
        { value: 'feat', name: 'feat:     添加新特性' },
        { value: 'fix', name: 'fix:      修复缺陷' },
        { value: 'docs', name: 'docs:     仅文档更改' },
        { value: 'style', name: 'style:    不影响代码功能的修改(空格、格式化、缺少分号等)', },
        { value: 'refactor', name: 'refactor: 代码重构，注意和feat、perf区分开', },
        { value: 'perf', name: 'perf:     性能提升', },
        { value: 'test', name: 'test:     修改或添加测试文件' },
        { value: 'revert', name: 'revert:   回退版本' },
        { value: 'ci', name: 'ci:      修改 ci 相关配置、脚本等' },
        { value: 'build', name: 'build:      构建，webpack rollup等' },
        { value: 'chore', name: 'chore:    杂务，不属于以上任何类型', },
    ],

    scopes: ['全局','功能模块'],

    allowTicketNumber: false,
    isTicketNumberRequired: false,
    ticketNumberPrefix: 'TICKET-',
    ticketNumberRegExp: '\\d{1,5}',

    // it needs to match the value for field type. Eg.: 'fix'
    /*
    scopeOverrides: {
      fix: [
  
        {name: 'merge'},
        {name: 'style'},
        {name: 'e2eTest'},
        {name: 'unitTest'}
      ]
    },
    */
    // override the messages, defaults are as follows
    messages: {
        type: "选中一种你的提交类型:",
        scope: '\n选择修改涉及范围 (可选):',
        // used if allowCustomScopes is true
        customScope: '请输入本次改动的范围（如：功能、模块等）:',
        subject: '简短说明:\n',
        body: '详细说明，使用"|"分隔开可以换行(可选):\n',
        breaking: '非兼容性，破坏性变化说明 (可选):\n',
        footer: '关联关闭的issue，例如：#31, #34(可选):\n',
        confirmCommit: '确定提交说明?',
    },

    allowCustomScopes: true,
    allowBreakingChanges: ['feat', 'fix'],
    // skip any questions you want
    skipQuestions: ['body'],

    // limit subject length
    subjectLimit: 100,
    // breaklineChar: '|', // It is supported for fields body and footer.
    // footerPrefix : 'ISSUES CLOSED:'
    // askForBreakingChangeFirst : true, // default is false
};
