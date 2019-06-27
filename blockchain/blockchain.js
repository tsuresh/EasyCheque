const driver = require('bigchaindb-driver')
//
exports.addPayment = function(fromUser, toUser, amount, chequeID){

        const newKey = new driver.Ed25519Keypair()

        const assetdata = {
                'payment': {
                        'from_user': fromUser,
                        'to_user': toUser,
                        'amount': amount,
                        'cheque_id': chequeID
                }
        }

        const metadata = null

        const txAddNewPayment = driver.Transaction.makeCreateTransaction(
                assetdata,
                metadata,

                // A transaction needs an output
                [ driver.Transaction.makeOutput(
                                driver.Transaction.makeEd25519Condition(newKey.publicKey))
                ],
                newKey.publicKey
        )

        const txAddNewPaymentSigned = driver.Transaction.signTransaction(txAddNewPayment, newKey.privateKey)

        const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/', {
        app_id: '8a0ff573',
        app_key: '67d6f2d05b198cf79004a147e902e855'
        })

        conn.postTransactionCommit(txAddNewPaymentSigned).then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))

        return true;

}

//conn.searchAssets('cde.').then(assets => console.log('Found assets with serial number Bicycle Inc.:', assets))