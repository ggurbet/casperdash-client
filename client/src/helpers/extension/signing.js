import {
    encodeBase16,
    CLTypeTag,
    CLValue,
    CLAccountHash,
    CLPublicKey
} from 'casper-js-sdk';
import browser from 'webextension-polyfill';

export async function updateStatusEvent(tabId, msg, {
    isUnlocked,
    isConnected,
    activeKey,
}) {
    chrome.tabs.sendMessage(tabId, {
        name: msg,
        detail: {
          isUnlocked,
          isConnected,
          activeKey,
        }
    });
}

export function getLastError() {
  const { lastError } = browser.runtime;
  if (!lastError) {
    return undefined;
  }

  if (lastError.stack && lastError.message) {
    return lastError;
  }

  return new Error(lastError.message);
}


export function verifyTargetAccountMatch(
  publicKeyHex,
  targetAccountHash
) {
  const providedTargetKeyHash = encodeBase16(
    CLPublicKey.fromHex(publicKeyHex).toAccountHash()
  );

  if (providedTargetKeyHash !== targetAccountHash) {
    throw new Error(
      "Provided target public key doesn't match the one in deploy"
    );
  }
}

export function getDeployPayment(deploy) {
    return deploy.payment.moduleBytes.getArgByName('amount')
        .value()
        .toString()
}

export function getDeployType(deploy) {
    return deploy.isTransfer()
        ? 'Transfer'
        : deploy.session.isModuleBytes()
        ? 'WASM-Based Deploy'
        : deploy.session.isStoredContractByHash() ||
          deploy.session.isStoredContractByName()
        ? 'Contract Call'
        : 'Contract Package Call';
}

export function getDeployArgs(deploy, targetKey) {
    let deployArgs = {};
    
    if (deploy.session.transfer) {
      deployArgs = parseTransferData(
        deploy.session.transfer,
        targetKey
      );
  
      return deployArgs;
    }
    
    if (deploy.session.moduleBytes) {
      deploy.session.moduleBytes.args.args.forEach(
        (argument, key) => {
          deployArgs[key] = parseDeployArg(argument);
        }
      );
      deployArgs['module_bytes'] =
        deploy.session.moduleBytes.moduleBytes.toString();
  
      return deployArgs;
    }
  
    let storedContract = getStoredContracts(deploy);
      storedContract.args.args.forEach((argument, key) => {
          deployArgs[key] = parseDeployArg(argument);
      });
      deployArgs['entry_point'] = storedContract.entryPoint;

    return deployArgs;
}

export const parseTransferData = (transferDeploy, providedTarget) => {
  const transferArgs = {};
  let targetFromDeployHex;

  const targetFromDeploy = transferDeploy.getArgByName('target');
  switch (targetFromDeploy.clType().tag) {
    case CLTypeTag.ByteArray:
      targetFromDeployHex = encodeBase16(targetFromDeploy.value());
      if (providedTarget) {
        verifyTargetAccountMatch(
          providedTarget.toLowerCase(),
          targetFromDeployHex
        );
      }
      transferArgs['Recipient (Hash)'] = targetFromDeployHex;
      break;
    case CLTypeTag.PublicKey:
      targetFromDeployHex = targetFromDeploy.toHex();
      if (providedTarget && targetFromDeployHex !== providedTarget) {
        throw new Error("The provided target public key does not match the one specified in the deploy.");
      }
      transferArgs['Recipient (Key)'] = targetFromDeployHex;
      break;
    default:
      throw new Error('The target specified in the deploy is not in the correct format, it must be either an AccountHash or a PublicKey.');
  }

  transferArgs['Amount'] = transferDeploy.getArgByName('amount').value().toString();
  transferArgs['Transfer ID'] = transferDeploy.getArgByName('id').value().unwrap().value().toString();

  return transferArgs;
};

export function sanitiseNestedLists(value) {
  const parsedValue = parseDeployArg(value);
  if (Array.isArray(parsedValue)) {
    const parsedType = value.vectorType;
    return `<${parsedType}>[...]`;
  }
  return parsedValue;
}


// eslint-disable-next-line complexity
export function parseDeployArg(arg) {
    if (!(arg instanceof CLValue)) {
      throw new Error('Argument should be a CLValue, received: ' + typeof arg);
    }
    const tag = arg.clType().tag;
    switch (tag) {
      case CLTypeTag.Unit:
        return String('CLValue Unit');

        case CLTypeTag.Key: {
          const key = arg;
          const value = key.value();
          if (key.isAccount() || key.isURef() || key.isHash()) {
            return parseDeployArg(value);
          }
          throw new Error('Failed to parse key argument');
        }

      case CLTypeTag.URef:
        return (arg).toFormattedStr();

      case CLTypeTag.Option: {
        const option = arg;
        if (option.isSome()) {
          return parseDeployArg(option.value().unwrap());
        } else {
          const optionValue = option.value().toString();
          const optionCLType = option.clType().toString().split(' ')[1];
          return `${optionValue} ${optionCLType}`;
        }
      }

      case CLTypeTag.List: {
        const list = (arg).value();
        const parsedList = list.map(member => {
          return sanitiseNestedLists(member);
        });
        return parsedList;
      }

      case CLTypeTag.ByteArray: {
        const bytes = (arg).value();
        return encodeBase16(bytes);
      }

      case CLTypeTag.Result: {
        const result = arg;
        const status = result.isOk() ? 'OK:' : 'ERR:';
        const parsed = parseDeployArg(result.value().val);
        return `${status} ${parsed}`;
      }

      case CLTypeTag.Map:
        return arg.value().toString();

      case CLTypeTag.Tuple1:
        return parseDeployArg(arg.value()[0]);

      case CLTypeTag.Tuple2:
      case CLTypeTag.Tuple3:
        return arg.value().map(member => parseDeployArg(member));
      
      case CLTypeTag.PublicKey:
        return arg.toHex();

      default:
        if (arg instanceof CLAccountHash) {
            return encodeBase16(arg.value());
        }
          
        return arg.value().toString();
    }
}


export function getStoredContracts(deploy) {
  if (deploy.session.storedContractByHash) {
    return deploy.session.storedContractByHash;
  } 
  
  if (deploy.session.storedContractByName) {
    return deploy.session.storedContractByName;
  } 
  
  if (deploy.session.storedVersionedContractByHash) {
    return deploy.session.storedVersionedContractByHash;
  } 
  
  if (deploy.session.storedVersionedContractByName) {
    return deploy.session.storedVersionedContractByName;
  }

  throw new Error(`Can not parse stored contract: ${deploy.session}`);
}