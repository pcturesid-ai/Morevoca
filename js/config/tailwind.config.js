tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', '"Montserrat"', 'sans-serif'],
      },
      colors: {
        canvas: '#F5F7FB',
        brand: {
          50: '#FFF3EB',
          100: '#FFE0D1',
          500: '#C2410C',
          600: '#C2410C',
          700: '#9A3412',
        },
      },
      boxShadow: {
        card: '0 2px 12px -2px rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02)',
        'card-hover': '0 8px 24px -4px rgba(194, 65, 12, 0.10), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        soft: '0 10px 30px -10px rgba(194, 65, 12, 0.28)',
      },
    },
  },
};
