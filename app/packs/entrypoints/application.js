// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Rails from "@rails/ujs"

import "channels"

import ReactOnRails from "react-on-rails";
import Button from "src/components/button";
import MessageBoard from "src/components/message_board";
import Navbar from "src/components/navbar";
import Alert from "src/components/alert";

import "stylesheets/application.scss"

require.context('../images', true)

ReactOnRails.register({
  Button,
  MessageBoard,
  Navbar,
  Alert
});

Rails.start()

// TO ENABLE ACTIVE STORAGE LATER
// import * as ActiveStorage from "@rails/activestorage"
// ActiveStorage.start()
