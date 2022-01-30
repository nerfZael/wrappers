const prompt = require("prompt");

export const promptForPassword = (): Promise<string> => {
  var schema = {
    properties: {
      password: {
        description: "Enter your password",
        hidden: true
      }
    }
  };

  prompt.start();

  return new Promise((resolve, reject) => {
    prompt.get(schema, (error: Error, result: { password: string }) => {
      if(error) {
        reject(error);
      } else {
        resolve(result.password);
      }
    });
  });
};