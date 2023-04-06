import React, { Component, Suspense } from 'react';
import {loadScript} from '../utilities';


class GooglePolygons extends Component {

    constructor(props){
        super(props);

        this.loadGoogleMaps = this.loadGoogleMaps.bind(this);
    }

    componentDidMount(){
        window.addEventListener('load', () => loadScript(this.loadGoogleMaps, 'googleMaps', 'http://maps.google.com/maps/api/js?key=AIzaSyA1r4lhEqwZh6kxkMTVLPtIGByzeh5JQuA&sensor=false&libraries=drawing'));

        if(document.readyState === "complete" || document.readyState === "interactive"){
          loadScript(this.loadGoogleMaps, 'googleMaps', 'http://maps.google.com/maps/api/js?key=AIzaSyA1r4lhEqwZh6kxkMTVLPtIGByzeh5JQuA&sensor=false&libraries=drawing');
        }
    }

    loadGoogleMaps(){
        const google = window.google;
        let selectedShape;
        let map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
        // Define the LatLng coordinates for the polygon.
        const triangleCoords = [
            new google.maps.LatLng(-33.168886, 149.556354),
            new google.maps.LatLng(-33.150492, 150.605548),
            new google.maps.LatLng(-34.013116, 150.558856),
            new google.maps.LatLng(-34.19619, 149.914782),
            new google.maps.LatLng(-33.933396, 149.270709),
            new google.maps.LatLng(-33.235534, 148.847735)
        ];
        let bermudaTriangle;

        const addPolygonShape = () => {
            

            // Construct the polygon.
             bermudaTriangle = new google.maps.Polygon({
              paths: triangleCoords,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 3,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              editable: true,
              draggable: true
            });

           // bermudaTriangle.setMap(map);
        };

        const printCords = (newShape) => {
            for (var i = 0; i < newShape.getPath().getLength(); i++) {
                console.log(newShape.getPath().getAt(i).toUrlValue(6));
            }
        }

        const deleteSelectedShape = () => {
            if (selectedShape) {
                selectedShape.setMap(null);
            }
        };

        const clearSelection = () => {
            if (selectedShape) {
                if (selectedShape.type !== 'marker') {
                    selectedShape.setEditable(false);
                }
                
                selectedShape = null;
            }
        };

        addPolygonShape();


        google.maps.event.addListener(bermudaTriangle, 'polygon', function (e) {
            var newShape = e.overlay;
            
            newShape.type = e.type;

            printCords(newShape);

            //This event is inside 'polygoncomplete' and fires when you edit the polygon by moving one of its anchors.
            google.maps.event.addListener(newShape.getPath(), 'set_at', function () {
                console.log('changed');
                printCords(newShape);
            });

            //This event is inside 'polygoncomplete' too and fires when you edit the polygon by moving on one of its anchors.
            google.maps.event.addListener(newShape.getPath(), 'insert_at', function () {
                console.log('also changed');
                printCords(newShape);
            });
            
        });

        // Delete an overlay shape
        google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);


    }

  render() {

    return (
       <>
        <div id="panel">
            <div id="color-palette"></div>
            <div>
                <button id="delete-button">Delete Selected Shape</button>
            </div>
        </div>
        <div id="map" style={{height: "400px", width: "400px"}}></div>
       </>
    );
  }
}

export default GooglePolygons;
