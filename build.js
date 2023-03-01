const fs = require('fs');

const base = ["HKVariants","HKVariantsRev","HKVariantsRevPhrases","JPShinjitaiCharacters","JPShinjitaiPhrases","JPVariants","JPVariantsRev","TWPhrasesIT","TWPhrasesName","TWPhrasesOther","TWPhrasesRev","TWVariants","TWVariantsRev","TWVariantsRevPhrases"];

const cn2t = ['STCharacters', 'STPhrases'];

const t2cn = ['TSCharacters', 'TSPhrases']

// copy from https://github.com/nk2028/opencc-js/blob/main/build.js#L11
function loadFile(fileName) {
  return fs
    .readFileSync(`node_modules/opencc-data/data/${fileName}.txt`, {
      encoding: 'utf-8'
    })
    .trimEnd()
    .split('\n')
    .map((line) => {
      const [k, vs] = line.split('\t');
      const v = vs.split(' ')[0]; // only select the first candidate, the subsequent candidates are ignored
      return [k, v];
    })
    .filter(([k, v]) => k !== v || k.length > 1) // remove “char => the same char” convertions to reduce file size
    .map(([k, v]) => k + ' ' + v)
    .join('|');
}

function writeData(target, files) {
  const result = [];
  result.push(`if(!globalThis.OpenCCJSData) {globalThis.OpenCCJSData = {};}`);
  for(let filename of files) {
    const content = loadFile(filename);
    result.push(`OpenCCJSData.${filename}="${content}";`);
  }
  if(!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  fs.writeFileSync(`dist/${target}.min.js`, result.join('\n'), {encoding: 'utf-8'});
}

writeData('data', base);
writeData('data.cn2t', cn2t);
writeData('data.t2cn', t2cn);