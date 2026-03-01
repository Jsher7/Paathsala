import algosdk from 'algosdk'

// Algorand TestNet configuration
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud'
const ALGOD_PORT = 443
const ALGOD_TOKEN = '' // AlgoNode doesn't require a token

const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT)

// Store for audit records (in-memory cache, also stored in DB)
const auditCache = []

/**
 * Create an Algorand audit record.
 * Writes an audit note to the Algorand TestNet as a zero-value transaction.
 */
export async function createAuditRecord(action, userId, details = {}) {
    const auditEntry = {
        action,
        userId: String(userId),
        details,
        timestamp: new Date().toISOString(),
        txId: null,
        status: 'pending'
    }

    try {
        // Check if we have Algorand keys configured
        const mnemonic = process.env.ALGORAND_MNEMONIC
        if (!mnemonic) {
            // No Algorand keys — store locally only
            auditEntry.status = 'local_only'
            auditEntry.txId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            auditCache.push(auditEntry)
            return auditEntry
        }

        // Recover account from mnemonic
        const account = algosdk.mnemonicToSecretKey(mnemonic)

        // Build audit note
        const auditNote = JSON.stringify({
            platform: 'Paathsala',
            action: auditEntry.action,
            userId: auditEntry.userId,
            timestamp: auditEntry.timestamp,
            details: auditEntry.details
        })

        // Get suggested transaction parameters
        const suggestedParams = await algodClient.getTransactionParams().do()

        // Create a zero-value payment transaction with audit data in the note field
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            sender: account.addr,
            receiver: account.addr, // Send to self (zero-value audit tx)
            amount: 0,
            note: new TextEncoder().encode(auditNote),
            suggestedParams
        })

        // Sign the transaction
        const signedTxn = txn.signTxn(account.sk)

        // Submit to the network
        const response = await algodClient.sendRawTransaction(signedTxn).do()
        auditEntry.txId = response.txid || response.txId
        auditEntry.status = 'confirmed'

        console.log(`Audit record created on Algorand TestNet: ${auditEntry.txId}`)
    } catch (error) {
        console.error('Algorand audit error:', error.message)
        auditEntry.status = 'failed'
        auditEntry.error = error.message
        auditEntry.txId = `failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    auditCache.push(auditEntry)

    // Keep cache manageable (last 100 entries)
    if (auditCache.length > 100) {
        auditCache.splice(0, auditCache.length - 100)
    }

    return auditEntry
}

/**
 * Get all audit records from the cache
 */
export function getAuditRecords(userId = null) {
    if (userId) {
        return auditCache.filter(r => r.userId === String(userId))
    }
    return [...auditCache]
}

/**
 * Get the Algorand explorer URL for a transaction
 */
export function getExplorerUrl(txId) {
    if (!txId || txId.startsWith('local_') || txId.startsWith('failed_')) {
        return null
    }
    return `https://testnet.explorer.perawallet.app/tx/${txId}`
}

export default { createAuditRecord, getAuditRecords, getExplorerUrl }
