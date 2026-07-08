import hre, { ethers } from 'hardhat'

async function main (): Promise<void> {
  const entryPointDeployment = await hre.deployments.get('EntryPoint')
  const entryPoint = await ethers.getContractAt('EntryPoint', entryPointDeployment.address)
  const senderCreatorAddress: string = await entryPoint.senderCreator()
  const senderCreatorCode = await ethers.provider.getCode(senderCreatorAddress)

  if (senderCreatorCode === '0x') {
    throw new Error(`SenderCreator has no code at ${senderCreatorAddress}`)
  }

  const artifact = await hre.deployments.getExtendedArtifact('SenderCreator')

  await hre.deployments.save('SenderCreator', {
    address: senderCreatorAddress,
    abi: artifact.abi,
    args: [],
    solcInputHash: entryPointDeployment.solcInputHash ?? artifact.solcInputHash,
    metadata: artifact.metadata,
    bytecode: artifact.bytecode,
    deployedBytecode: artifact.deployedBytecode,
    devdoc: artifact.devdoc,
    userdoc: artifact.userdoc,
    storageLayout: artifact.storageLayout,
    methodIdentifiers: artifact.methodIdentifiers,
    gasEstimates: artifact.evm?.gasEstimates
  })

  console.log(`Saved SenderCreator deployment at ${senderCreatorAddress}`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
