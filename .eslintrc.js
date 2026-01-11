module.exports = {
    plugins: ['i18n-text'],
    rules: {
        'i18n-text/no-literal-string': [
            'warn',
            {
                markupOnly: true,
                ignoreAttribute: [
                    'data-testid',
                    'id',
                    'key',
                    'className'
                ]
            }
        ]
    }
};