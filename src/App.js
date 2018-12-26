/*eslint-disable no-irregular-whitespace*/

import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import gIcon from "./leaf-green.png";
import rIcon from "./leaf-red.png";
import shadow from "./leaf-shadow.png";

import react from './react.png';

import {
  Card,
  CardText,
  Form,
  Label,
  FormGroup,
  Input,
  CardTitle,
  Button
} from "reactstrap";

import "./App.css";

const IP_API = "https://ipapi.co/json";
const DB_API = window.location.hostname === 'localhost' ? "http://localhost:5000/markers" : "";

var greenIcon = L.icon({
  iconUrl: gIcon,
  shadowUrl: shadow,

  iconSize: [38, 95], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var redIcon = L.icon({
  iconUrl: rIcon,
  shadowUrl: shadow,

  iconSize: [38, 95], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

class App extends Component {
  state = {
    lat: 0,
    lng: 0,
    zoom: 2.3,
    set: false,
    notHidden: true,
    messages: []
  };

  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 13,
          set: true
        });
      },
      err => {
        console.log("Request for location access rejected!");
        console.log("Attempting to find approximate location by ip...");
        fetch(IP_API)
          .then(response => response.json())
          .then(location1 => {
            console.log(
              `Approximate coordinates: ${location1.latitude}, ${
              location1.longitude
              }`
            );
            this.setState({
              lat: location1.latitude,
              lng: location1.longitude,
              zoom: 13,
              set: true
            });
          });
      }
    );
    this.getPins();
  };

  handleSubmit = event => {
    event.preventDefault();
    let pin = {
      name: this.state.name,
      message: this.state.message,
      lat: this.state.lat,
      lng: this.state.lng
    };
    fetch(DB_API, {
      method: "POST",
      body: JSON.stringify(pin),
      headers: { "Content-Type": "application/json" }
    }).then(resp => console.log(resp));
    window.location.reload()
  };

  getPins = () => {
    fetch(DB_API)
      .then(resp => resp.json())
      .then(messages => {
        const haveSeenLocation = {};
        messages = messages.reduce((all, message) => {
          let key = `${message.lat.toFixed(3)}${message.lng.toFixed(3)}`;
          if (haveSeenLocation[key]) {
            haveSeenLocation[key].otherMessages =
              haveSeenLocation[key].otherMessages || [];
            haveSeenLocation[key].otherMessages.push(message);
          } else {
            haveSeenLocation[key] = message;
            all.push(message);
          }
          return all;
        }, []);
        this.setState({ messages: messages });
      });
  };

  handleChange = event => {
    console.log(event.target.value, event.target.id);
    this.setState({ [event.target.id]: event.target.value });
  };


  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="map">
        {" "}
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.set ? (
            <Marker position={position} icon={redIcon}>
              <Popup>Your location!</Popup>
            </Marker>
          ) : (
              ""
            )}
          {this.state.messages.map(message => (
            <Marker
              key={message._id}
              position={[message.lat, message.lng]}
              icon={greenIcon}
            >
              <Popup>
                <p>
                  <em>{message.name}:</em> {message.message}
                </p>
                {message.otherMessages
                  ? message.otherMessages.map(message => (
                    <p key={message._id}>
                      <em>{message.name}:</em> {message.message}
                    </p>
                  ))
                  : ""}
              </Popup>
            </Marker>
          ))}
        </Map>
        {this.state.notHidden ? (
          <Card className="carder" body>
            <CardTitle>Welcome! 🗺</CardTitle>
            <CardText>Leave a pin telling me where you visited from!</CardText>

            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  onChange={this.handleChange}
                  type="text"
                  id="name"
                  placeholder="Enter your name!"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="message">Message</Label>
                <Input
                  onChange={this.handleChange}
                  type="textarea"
                  id="message"
                  placeholder="Enter your message!"
                  required
                />
              </FormGroup>
              <Button color="info" type="submit">
                Post!
              </Button>
              <Button
                color="link"
                type="button"
                onClick={() => {
                  this.setState({ notHidden: false });
                }}
              >
                Hide
              </Button>
            </Form>
          </Card>
        ) : (
            <Card className="hide">
              <Button
                color="link"
                type="button"
                onClick={() => this.setState({ notHidden: true })}
              >
                Unhide
            </Button>
            </Card>
          )}
        <Card className="author">
          <img src={react} className="image" alt="React logo"></img>
          <a
            href="http://thejoulethief.github.io"
            rel="noopener noreferrer"
            target="_blank"
          > Anupam🐱‍💻
          </a>

        </Card>
      </div>
    );
  }
}

export default App;
