import http from "http";

const API_URL = "http://127.0.0.1:3000";

function makePostRequest(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsedUrl = new URL(url);

    const req = http.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let responseBody = "";
        res.on("data", (chunk) => (responseBody += chunk));
        res.on("end", () => {
          try {
            resolve({
              statusCode: res.statusCode,
              data: JSON.parse(responseBody),
            });
          } catch {
            resolve({
              statusCode: res.statusCode,
              raw: responseBody,
            });
          }
        });
      }
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function runAllTests() {
  console.log(
    "================================================================"
  );
  console.log(
    "   DEVOPS ASSIGNMENT 3: END-TO-END VERIFICATION TEST SUITE     "
  );
  console.log("   Testing API at: " + API_URL + "/run");
  console.log(
    "================================================================\n"
  );

  let allPassed = true;

  try {
    console.log("--- TEST 1: JavaScript Execution ---");
    const res1 = await makePostRequest(`${API_URL}/run`, {
      language: "javascript",
      code: 'console.log("Hello from JavaScript");',
    });
    console.log(`Status Code: ${res1.statusCode}`);
    console.log("Response:", JSON.stringify(res1.data, null, 2));

    if (
      res1.statusCode === 200 &&
      res1.data.stdout?.trim() === "Hello from JavaScript"
    ) {
      console.log(">>> [PASS] TEST 1: JavaScript executed successfully.\n");
    } else {
      console.error(">>> [FAIL] TEST 1 failed!\n");
      allPassed = false;
    }

    console.log("--- TEST 2: JavaScript with stdin Input ---");
    const jsInputCode = `const fs = require("fs");
const input = fs.readFileSync(0, "utf8");
console.log(input.trim());`;

    const res2 = await makePostRequest(`${API_URL}/run`, {
      language: "javascript",
      code: jsInputCode,
      input: "Hello Runner",
    });
    console.log(`Status Code: ${res2.statusCode}`);
    console.log("Response:", JSON.stringify(res2.data, null, 2));

    if (
      res2.statusCode === 200 &&
      res2.data.stdout?.trim() === "Hello Runner"
    ) {
      console.log(
        ">>> [PASS] TEST 2: JavaScript with stdin executed successfully.\n"
      );
    } else {
      console.error(">>> [FAIL] TEST 2 failed!\n");
      allPassed = false;
    }

    console.log("--- TEST 3: C++ Execution ---");
    const cppCode = `#include <iostream>

int main() {
    std::cout << "Hello from C++";
    return 0;
}`;

    const res3 = await makePostRequest(`${API_URL}/run`, {
      language: "cpp",
      code: cppCode,
    });
    console.log(`Status Code: ${res3.statusCode}`);
    console.log("Response:", JSON.stringify(res3.data, null, 2));

    if (
      res3.statusCode === 200 &&
      res3.data.stdout?.trim() === "Hello from C++"
    ) {
      console.log(
        ">>> [PASS] TEST 3: C++ compiled and executed successfully.\n"
      );
    } else {
      console.error(">>> [FAIL] TEST 3 failed!\n");
      allPassed = false;
    }

    console.log("--- TEST 4: Invalid C++ (Compilation Error) ---");
    const invalidCppCode = `#include <iostream>

int main() {
    std::cout << "Missing semicolon"
    return 0;
}`;

    const res4 = await makePostRequest(`${API_URL}/run`, {
      language: "cpp",
      code: invalidCppCode,
    });
    console.log(`Status Code: ${res4.statusCode}`);
    console.log("Response:", JSON.stringify(res4.data, null, 2));

    if (
      res4.statusCode === 400 &&
      res4.data.message === "Compilation Error" &&
      res4.data.stderr.includes("error:")
    ) {
      console.log(
        ">>> [PASS] TEST 4: Clean compilation error returned without crashing API.\n"
      );
    } else {
      console.error(">>> [FAIL] TEST 4 failed!\n");
      allPassed = false;
    }

    console.log("--- TEST 5: Infinite JavaScript Loop Timeout ---");
    const infiniteJsCode = "while (true) {}";

    const timeoutStart = Date.now();
    const res5 = await makePostRequest(`${API_URL}/run`, {
      language: "javascript",
      code: infiniteJsCode,
    });
    const elapsed = Date.now() - timeoutStart;
    console.log(`Execution took: ${elapsed} ms`);
    console.log(`Status Code: ${res5.statusCode}`);
    console.log("Response:", JSON.stringify(res5.data, null, 2));

    if (
      res5.statusCode === 408 &&
      res5.data.message === "Execution Timed Out"
    ) {
      console.log(
        ">>> [PASS] TEST 5: Infinite loop terminated cleanly by timeout without crashing API.\n"
      );
    } else {
      console.error(">>> [FAIL] TEST 5 failed!\n");
      allPassed = false;
    }

    console.log("--- TEST 6: Concurrent Execution (Parallel Requests) ---");
    const reqA = makePostRequest(`${API_URL}/run`, {
      language: "javascript",
      code: 'console.log("Result A: " + (25 * 4));',
    });

    const reqB = makePostRequest(`${API_URL}/run`, {
      language: "cpp",
      code: '#include <iostream>\nint main() { std::cout << "Result B: " << 100 + 200; return 0; }',
    });

    const reqC = makePostRequest(`${API_URL}/run`, {
      language: "javascript",
      code: 'const fs = require("fs"); console.log("Result C: " + fs.readFileSync(0, "utf8").toLowerCase());',
      input: "PARALLEL TEST DATA",
    });

    const reqD = makePostRequest(`${API_URL}/run`, {
      language: "cpp",
      code: '#include <iostream>\nint main() { std::cout << "Result D: " << 8888; return 0; }',
    });

    const [outA, outB, outC, outD] = await Promise.all([
      reqA,
      reqB,
      reqC,
      reqD,
    ]);

    console.log(
      "Request A Status:",
      outA.statusCode,
      "| Output:",
      outA.data.stdout?.trim()
    );
    console.log(
      "Request B Status:",
      outB.statusCode,
      "| Output:",
      outB.data.stdout?.trim()
    );
    console.log(
      "Request C Status:",
      outC.statusCode,
      "| Output:",
      outC.data.stdout?.trim()
    );
    console.log(
      "Request D Status:",
      outD.statusCode,
      "| Output:",
      outD.data.stdout?.trim()
    );

    const okA =
      outA.statusCode === 200 && outA.data.stdout?.trim() === "Result A: 100";
    const okB =
      outB.statusCode === 200 && outB.data.stdout?.trim() === "Result B: 300";
    const okC =
      outC.statusCode === 200 &&
      outC.data.stdout?.trim() === "Result C: parallel test data";
    const okD =
      outD.statusCode === 200 && outD.data.stdout?.trim() === "Result D: 8888";

    if (okA && okB && okC && okD) {
      console.log(
        ">>> [PASS] TEST 6: All concurrent requests isolated, no output mixing or file collision.\n"
      );
    } else {
      console.error(">>> [FAIL] TEST 6 failed!\n");
      allPassed = false;
    }
  } catch (err) {
    console.error("Fatal test runner error:", err);
    allPassed = false;
  }

  console.log(
    "================================================================"
  );
  if (allPassed) {
    console.log(
      "   ALL 6 TESTS PASSED WITH 100% SUCCESS!                       "
    );
  } else {
    console.log(
      "   SOME TESTS FAILED! CHECK OUTPUT ABOVE.                      "
    );
  }
  console.log(
    "================================================================"
  );

  process.exit(allPassed ? 0 : 1);
}

runAllTests();
