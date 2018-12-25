import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

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

const API = "https://ipapi.co/json";

class App extends Component {
  state = {
    lat: 0,
    lng: 0,
    zoom: 2.3,
    set: false
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
        fetch(API)
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
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state.message);
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
            <Marker position={position}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          ) : (
            ""
          )}
        </Map>
        <Card className="carder" body>
          <CardTitle>Welcome!</CardTitle>
          <CardText>Leave a pin telling me where you visited from!</CardText>

          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                onChange={this.handleChange}
                type="text"
                id="name"
                placeholder="Enter your name!"
              />
            </FormGroup>
            <FormGroup>
              <Label for="message">Message</Label>
              <Input
                onChange={this.handleChange}
                type="textarea"
                id="message"
                placeholder="Enter your message!"
              />
            </FormGroup>
            <Button color="info" type="submit">
              Post!
            </Button>
          </Form>
        </Card>
      </div>
    );
  }
}

export default App;
