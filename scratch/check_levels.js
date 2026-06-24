const fs = require('fs');
[1,2,3,4].forEach(n => {
  const code = fs.readFileSync('levels/level' + n + '.js', 'utf8');
  const fn = new Function(code + '; return level' + n + ';');
  const lv = fn();
  const colCounts = lv.layout.map((r, i) => r.length);
  const unique = [...new Set(colCounts)];
  if (unique.length > 1) {
    console.log('level' + n + ': *** MISMATCH *** rows have different lengths:');
    colCounts.forEach((c, i) => console.log('  row ' + i + ': ' + c + ' cols'));
  } else {
    console.log('level' + n + ': all rows = ' + unique[0] + ' cols OK');
  }
  // Also check validator conditions
  console.log('  rows=' + lv.layout.length + ' name=' + !!lv.name + ' id=' + (typeof lv.id === 'number'));
});
