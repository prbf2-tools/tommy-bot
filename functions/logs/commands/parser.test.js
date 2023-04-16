import { parseCommandLine } from "./command";

test("parseCommandLine", () => {
  const tests = [
    {
      in: "[2023-04-01 10:11] !INIT           performed by 'TAG name': ",
      out: {
        "date": new Date("2023-04-01T08:11:00.000Z"),
        "body": "",
        "command": "INIT",
        "issuer": {
          "name": "name",
          "tag": "TAG",
          "typ": 0,
        },
      }
    }, {
      in: "[2023-04-14 20:23] !REPORT         performed by ' Shil': dont switch!",
      out: {
        "body": "dont switch!",
        "command": "REPORT",
        "issuer": {
          "name": "Shil",
          "typ": 0,
        },
        "date": new Date("2023-04-14T18:23:00.000Z"),
      }
    }
  ];

  tests.forEach(t => {
    expect(parseCommandLine(t.in)).toEqual(t.out);
  });
});
