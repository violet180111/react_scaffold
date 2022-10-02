const styleObject = {
  center_flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  scroll: (axis?: 'X' | 'Y') => ({
    [`overflow${axis ? `${axis}` : ''}`]: 'auto',
  }),
};

export default styleObject;
