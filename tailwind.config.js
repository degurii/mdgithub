// prose-code:bg-neutral-300`
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            p: {
              a: {
                color: theme('blue-600'),
                '&:visited': {
                  color: theme('purple-600'),
                },
              },
              code: {
                backgroundColor: theme('purple-200'),
                '&:before': {
                  content: 'none',
                },
                '&:after': {
                  content: 'none',
                },
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};
