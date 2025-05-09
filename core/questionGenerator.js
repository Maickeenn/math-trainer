// core/questionGenerator.js

const levelOps = {
  1: ["+"],
  2: ["+"],
  3: ["+"],
  4: ["+"],
  5: ["+", "-"],
  6: ["+", "-"],
  7: ["+", "-"],
  8: ["+", "-", "*"],
  9: ["+", "-", "*"],
  10: ["+", "-", "*", "/"],
  11: ["^"],
  12: ["frac"]
};

const baseConfig = {
  "+": (level) => ({ terms: level <= 4 ? 2 : 3, min: 1, max: 50 * level }),
  "-": (level) => ({ terms: level <= 6 ? 2 : 3, min: 1, max: 30 * level }),
  "*": (level) => ({ terms: 2, min: 1, max: level < 10 ? 12 + level : 30 }),
  "/": (level) => ({ terms: 2, maxDiv: 10 + level, exactDivision: level < 12 }),
  "^": () => ({ baseMin: 2, baseMax: 6, expMin: 2, expMax: 4 }),
  "frac": () => ({ numMin: 1, numMax: 9, denMin: 2, denMax: 10, operations: ["+", "-"] })
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const opUsageMap = new Map();

const generators = {
  "+": ({ terms, min, max }) => {
    const nums = Array.from({ length: terms }, () => randInt(min, max));
    return { question: nums.join(" + "), answer: nums.reduce((a, b) => a + b, 0) };
  },
  "-": ({ terms, min, max }) => {
    const nums = Array.from({ length: terms }, () => randInt(min, max)).sort((a, b) => b - a);
    return { question: nums.join(" - "), answer: nums.reduce((a, b) => a - b, 0) };
  },
  "*": ({ min, max }) => {
    const a = randInt(min, max), b = randInt(min, max);
    return { question: `${a} × ${b}`, answer: a * b };
  },
  "/": ({ maxDiv, exactDivision }) => {
    const b = randInt(1, maxDiv);
    const r = randInt(1, maxDiv);
    const a = exactDivision ? b * r : randInt(b + 1, b * maxDiv);
    return { question: `${a} ÷ ${b}`, answer: Math.floor(a / b) };
  },
  "^": ({ baseMin, baseMax, expMin, expMax }) => {
    const base = randInt(baseMin, baseMax);
    const exp = randInt(expMin, expMax);
    return { question: `${base}^${exp}`, answer: Math.pow(base, exp) };
  },
  "frac": ({ numMin, numMax, denMin, denMax, operations }) => {
    const op = operations[Math.floor(Math.random() * operations.length)];
    const n1 = randInt(numMin, numMax), d1 = randInt(denMin, denMax);
    const n2 = randInt(numMin, numMax), d2 = randInt(denMin, denMax);
    const question = `${n1}/${d1} ${op} ${n2}/${d2}`;
    const v1 = n1 / d1, v2 = n2 / d2;
    const answer = parseFloat((op === "+" ? v1 + v2 : v1 - v2).toFixed(2));
    return { question, answer };
  }
};

export function generateQuestionByLevel(level) {
  const availableOps = levelOps[level] || ["+"];
  const usage = opUsageMap.get(level) || Object.fromEntries(availableOps.map(op => [op, 0]));

  const weights = availableOps.map(op => 1 / (usage[op] + 1));
  const total = weights.reduce((a, b) => a + b, 0);
  const roll = Math.random() * total;

  let acc = 0, op = availableOps[0];
  for (let i = 0; i < availableOps.length; i++) {
    acc += weights[i];
    if (roll <= acc) {
      op = availableOps[i];
      break;
    }
  }

  usage[op]++;
  opUsageMap.set(level, usage);

  const params = baseConfig[op](level);
  return generators[op](params);
}
