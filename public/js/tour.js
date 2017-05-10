// Instance the tour
const museTour = new Tour({
  steps: [
    {
      element: '#homer',
      title: 'WELCOME TO CFH. ',
      content: 'A game for terrible people desperately trying to do good.'
    },

    {
      element: '#menuItems',
      title: 'This is the menu bar panel. ',
      content: 'All the menu items are defined here.'
    },
    {
      element: '#Avators',
      title: 'Avators',
      content: 'Select an avator of your choice'
    },
    {
      element: '#sign-in',
      title: 'This is the sign button',
      content: 'click here to sign in.'
    },
    {
      element: '#sign-up',
      title: 'Sign up here!',
      content: 'Enter your credentials to be signed up.'
    }
  ]
});

// Initialize the tour
museTour.init();
museTour.start().goTo(1);

const welcome = {
  start() {
    museTour.restart();
  }
};
