
//functions
const example = async ((filename, content) => {
    try {
      await fs.writeFile(`data/${filename}.json`, content);
    } catch (err) {
      console.log(err);
      await fs.writeFile(`err/${filename}.json`, err);
    }
  })

  module.exports = {example} 
