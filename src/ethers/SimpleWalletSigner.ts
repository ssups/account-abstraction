import {AbstractAASigner} from "./AbstractAASigner";
import {BytesLike} from "@ethersproject/bytes";
import {TransactionRequest} from "@ethersproject/providers";
import {SimpleWallet__factory} from '../../typechain'
import {Contract} from "ethers";

export class SimpleWalletSigner extends  AbstractAASigner {

  /**
   * create deployment transaction.
   * Used to initialize the initCode of a userOp. also determines create2 address of the wallet.
   * NOTE: MUST use the signer address as part of the init signature.
   * @return BytesLike the value to put into the "initCode"
   */
  async _createDeploymentTransaction(entryPointAddress: string, ownerAddress:string): Promise<BytesLike> {
    return new SimpleWallet__factory()
      .getDeployTransaction(entryPointAddress, ownerAddress).data!
  }

  /**
   * create the entryPoint calldata for a given user transaction.
   * @param wallet the wallet object (created with _connectWallet)
   * @param tx
   *
   * @return BytesLike the value to put into callData
   */
  async _createExecFromEntryPoint(wallet: Contract, tx: TransactionRequest): Promise<BytesLike> {
    return await wallet.populateTransaction.execFromEntryPoint(tx.to!, tx.value ?? 0, tx.data!).then(tx => tx.data!)
  }

  /**
   * connect to a pre-deployed wallet contract
   * The wallet must be owned by our signer, support the "exec" method (used by "_createExecFromEntryPoint") and "nonce" view method
   * @param address
   */
  async _connectWallet(address: any) : Promise<Contract> {
    return SimpleWallet__factory.connect(address, this.signer)
  }

}