import path from 'path';
import fs from 'fs';
const fileName = path.join(__dirname, 'savedWalletNode.json');
export function setWalletNodes(nodes) {
  fs.writeFileSync(fileName, Buffer.from(JSON.stringify(nodes, null,  2)));
}

export function getWalletNodes() {
  let nodes = null;
  if (fs.existsSync(fileName)) {
    try {
      nodes = JSON.parse(fs.readFileSync(fileName).toString());
    } catch(e) {
      console.error(e)
    }

  }
  return nodes;
}