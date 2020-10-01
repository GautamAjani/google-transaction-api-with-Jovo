const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
  new GoogleAssistant(),
  new JovoDebugger()
);

const orderOptions = {
  requestDeliveryAddress: false,
};

const presentationOptions = {
  actionProvidedOptions: {
    displayName: "RESERVE"
  }
};

app.setHandler({
  LAUNCH() {
    this.$googleAction.showSuggestionChips(['Check no payment']);
    this.ask("Welcome to transaction sample. try say check transaction without payment")
  },

  Transaction_Check_No_Payment() {
    this.$googleAction.$transaction.checkRequirements();
    this.ask('Check');
  },

  ON_TRANSACTION: {
    TRANSACTION_REQUIREMENTS_CHECK() {
      if (this.$googleAction.$transaction.canTransact()) {
        this.$googleAction.$transaction.askForDeliveryAddress('Address?');
      } else {
        this.tell('Further action is required')
      }
    },
    DELIVERY_ADDRESS() {
      if (this.$googleAction.$transaction.isDeliveryAddressAccepted()) {
        this.$googleAction.$transaction.buildReservation(order)
      } else if (this.$googleAction.$transaction.isDeliveryAddressRejected()) {
        this.tell('We need your address to proceed.')
      }
    },
    TRANSACTION_DECISION() {
      if (this.$googleAction.$transaction.isReservationAccepted()) {
        const reservation = this.$googleAction.$transaction.getReservation();
        reservation.lastUpdateTime = new Date().toISOString()
        reservation.contents.lineItems[0].reservation.status = 'CONFIRMED'
        reservation.contents.lineItems[0].reservation.userVisibleStatusLabel = 'Reservation confirmed';
        this.$googleAction.$transaction.updateReservation(reservation, 'Reservation created')
        this.ask('Reservation confirmed!')
      }
    }
  }
});

const order = {
  transactionMerchant: {
    id: 'http://www.example.com',
    name: 'Test transaction',
  },
  contents: {
    lineItems: [
      {
        id: 'LINE_ITEM_ID',
        name: 'Dinner reservation',
        description: 'A world of flavors all in one destination.',
        reservation: {
          status: 'PENDING',
          userVisibleStatusLabel: 'Reservation is pending.',
          type: 'RESTAURANT',
          reservationTime: {
            timeIso8601: '2020-01-16T01:30:15.01Z',
          },
          userAcceptableTimeRange: {
            timeIso8601: '2020-01-15/2020-01-17',
          },
          partySize: 6,
          staffFacilitators: [
            {
              name: 'John Smith',
            },
          ],
          location: {
            zipCode: '94086',
            city: 'Sunnyvale',
            postalAddress: {
              regionCode: 'US',
              postalCode: '94086',
              administrativeArea: 'CA',
              locality: 'Sunnyvale',
              addressLines: [
                '222, Some other Street',
              ],
            },
          },
        },
      },
    ],
  },
  buyerInfo: {
    email: 'janedoe@gmail.com',
    firstName: 'Jane',
    lastName: 'Doe',
    displayName: 'Jane Doe',
  },
  followUpActions: [
    {
      type: 'VIEW_DETAILS',
      title: 'View details',
      openUrlAction: {
        url: 'http://example.com',
      },
    },
    {
      type: 'CALL',
      title: 'Call us',
      openUrlAction: {
        url: 'tel:+16501112222',
      },
    },
    {
      type: 'EMAIL',
      title: 'Email us',
      openUrlAction: {
        url: 'mailto:person@example.com',
      },
    },
  ],
  termsOfServiceUrl: 'http://www.example.com'
}
module.exports.app = app;
