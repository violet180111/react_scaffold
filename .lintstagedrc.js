module.exports = {
  'src/*.{ts,tsx}': ['prettier --write', 'eslint  --fix'],
  '*.md': ['prettier --write'],
};
