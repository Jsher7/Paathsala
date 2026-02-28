import fetch from 'node-fetch'

const PISTON_API = 'https://emkc.org/api/v2/piston'

const LANGUAGE_VERSIONS = {
  python: '3.10.0',
  javascript: '18.15.0',
  java: '15.0.2',
  cpp: '10.2.0',
  sql: '3.16.0'
}

export async function executeCode(language, code, stdin = '') {
  try {
    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: language,
        version: LANGUAGE_VERSIONS[language] || '*',
        files: [{ name: `main.${getFileExtension(language)}`, content: code }],
        stdin: stdin
      })
    })
    
    const data = await response.json()
    
    if (data.message) {
      throw new Error(data.message)
    }
    
    return {
      stdout: data.run?.stdout || '',
      stderr: data.run?.stderr || '',
      code: data.run?.code || 0,
      output: (data.run?.stdout || '') + (data.run?.stderr || '')
    }
  } catch (error) {
    throw new Error(`Code execution failed: ${error.message}`)
  }
}

export async function runTestCases(assignment, code) {
  const results = []
  
  for (const testCase of assignment.testCases) {
    try {
      const output = await executeCode(assignment.language, code, testCase.input)
      
      const actualOutput = output.stdout.trim()
      const expectedOutput = testCase.expectedOutput.trim()
      
      results.push({
        testCaseId: testCase._id,
        passed: actualOutput === expectedOutput,
        input: testCase.input,
        output: actualOutput,
        expected: expectedOutput,
        isHidden: testCase.isHidden
      })
    } catch (error) {
      results.push({
        testCaseId: testCase._id,
        passed: false,
        input: testCase.input,
        output: error.message,
        expected: testCase.expectedOutput,
        isHidden: testCase.isHidden,
        error: true
      })
    }
  }
  
  return results
}

function getFileExtension(language) {
  const extensions = {
    python: 'py',
    javascript: 'js',
    java: 'java',
    cpp: 'cpp',
    sql: 'sql'
  }
  return extensions[language] || 'txt'
}
