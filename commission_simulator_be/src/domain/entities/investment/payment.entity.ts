export class BasePayment {
  constructor(
    public readonly address: string,
    public readonly network: string,
    public readonly fundsGoal: number,
    public readonly smartContractAddress: string,
  ) {}
}

export class SinglePayment extends BasePayment {
  constructor(
    address: string,
    network: string,
    fundsGoal: number,
    smartContractAddress: string,
    public readonly accounts: string[],
  ) {
    super(address, network, fundsGoal, smartContractAddress);
  }
}

export class PaymentStatus extends BasePayment {
  constructor(
    address: string,
    network: string,
    fundsGoal: number,
    smartContractAddress: string,
    public readonly forwardAddresses: string[],
    public readonly amountCaptured: number,
    public readonly status: string,
    public readonly fundStatus: string,
    public readonly processStep: number,
    public readonly processTotalSteps: number,
    public readonly currentBalance: number,
    public readonly smartContractSymbol: string,
    public readonly fundsExpirationAt: number,
    public readonly isPaymentReceived: boolean,
  ) {
    super(address, network, fundsGoal, smartContractAddress);
  }
}

export class PaymentStatusTime {
  constructor(
    public readonly timeStart: number,
    public readonly timeEnd: number,
    public readonly timeDelta: number,
  ) {}
}

export class PaymentStatusResponseData {
  constructor(
    public readonly data: PaymentStatus,
    public readonly time: PaymentStatusTime,
  ) {}
}
