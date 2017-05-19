angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', 'ngIntroService', '$timeout', function ($scope, Global, $location, socket, game, AvatarService, ngIntroService, $timeout) {
    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function () {
      if ($location.search().error) {
        return $location.search().error;
      }
      return false;
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });


    $scope.global = Global;

    $scope.IntroOptions = {
      steps: [
        {
          element: '#homer',
          intro: 'WELCOME TO CFH.',
          position: 'bottom'
        },
        {
          element: '#menuItems',
          intro: 'All the menu items are defined here.',
          position: 'left'
        },
        {
          element: '#content',
          intro: 'How to play the game',
          position: 'top'
        },
        {
          element: '#contain-avatars',
          intro: 'select avator.',
          position: 'bottom'
        },
        {
          element: '#sign-up',
          intro: 'Enter your credentials to be signed up or play as guest.',
          position: 'top'
        }
      ],
      showStepNumbers: false,
      showBullets: false,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      nextLabel: 'next',
      prevLabel: '<span style="color:green">Previous</span>',
      skipLabel: 'Exit',
      doneLabel: 'Thanks'
    };

    $scope.CompletedEvent = function () {

    };
    $scope.ExitEvent = function () {

    };
    $scope.ChangeEvent = function () {

    };
    $scope.BeforeChangeEvent = function () {

    };
    $scope.AfterChangeEvent = function () {

    };
    $scope.clearAndStartNewIntro = function () {
      $scope.IntroOptions = {
        steps: [
          {
            element: '#homer',
            intro: 'WELCOME TO CFH.',
            position: 'top'
          },

          {
            element: '#menuItems',
            intro: 'All the menu items are defined here.',
            position: 'top'
          },
          {
            element: '#Avators',
            intro: 'Select an avator of your choice',
            position: 'top'
          },
          {
            element: '#sign-in',
            intro: 'click here to sign in.',
            position: 'top'
          },
          {
            element: '#sign-up',
            intro: 'Enter your credentials to be signed up or play as guest.',
            position: 'top'
          }
        ],
        showStepNumbers: true,
        showBullets: true,
        exitOnOverlayClick: false,
        exitOnEsc: false,
        nextLabel: '<strong style="color:green">Next!</strong>',
        prevLabel: '<span style="color:red">Previous</span>',
        skipLabel: 'Skip',
        doneLabel: 'Done'
      };
      ngIntroService.clear();
      ngIntroService.setOptions($scope.IntroOptions);

      ngIntroService.onComplete(function () {

      });

      ngIntroService.onExit(function () {

      });

      ngIntroService.onBeforeChange(function () {

      });

      ngIntroService.onChange(() => {

      });

      ngIntroService.onAfterChange(() => {

      });

      ngIntroService.start();
    };
    $scope.startTour = function () {
      $timeout(
        function () { $scope.CallMe(); },
        400
      );
    };
  }]);
