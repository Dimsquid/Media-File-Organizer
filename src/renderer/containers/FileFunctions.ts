const fs = require("fs");

export function fileWriter(path: string, JSONObj: Object) {
  fs.writeFile(path, JSON.stringify(JSONObj), (err: any) => {
    if (err) {
      alert("An error ocurred creating the file " + err.message);
    }
  });
}
