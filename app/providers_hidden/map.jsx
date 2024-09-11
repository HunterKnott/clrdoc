'use client';

// import { Loader } from '@googlemaps/js-api-loader';
import { useJsApiLoader } from '@react-google-maps/api';
// import { Library } from '@googlemaps/js-api-loader';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const libs = ["core", "maps", "places", "marker"];
const mapsApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY

const buildMapInfoCardContent = (title, body) => {
    return `
    <div className="">
        <div className="">${title}</div>
        <div className="">${body}</div>
    </div>`;
}

export default function Map ({ latlong }) {
    const [map, setMap] = useState(null);
    const [autoComplete, setAutoComplete] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: mapsApiKey,
        libraries: libs
    });
    const mapRef = useRef(null);
    const placeAutoCompleteRef = useRef(null);

    useEffect(() => {
            if (isLoaded) {
            const mapOptions = {
                center: {
                    lat: latlong.coordinates[0],
                    lng: latlong.coordinates[1]
                },
                zoom: 15,
                mapId: "MY_MAP_ID",
            }

            const gMap = new google.maps.Map(mapRef.current, mapOptions);
            const testBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng({ lat: 39.809073, lng: -112.214545 }), // South-west corner of Utah County
                new google.maps.LatLng({ lat: 40.476734, lng: -111.610297 }) // North-east corner of Utah County
            )

            const gAutoComplete = new google.maps.places.Autocomplete(placeAutoCompleteRef.current, {
                bounds: testBounds,
                fields: ['formatted_address', 'geometry', 'name'],
                componentRestrictions: {
                    country: ['us']
                }
            });
            setAutoComplete(gAutoComplete);
            setMap(gMap);
        }
    }, [isLoaded])

    useEffect(() => {
        if(autoComplete) {
            autoComplete.addListener('place_changed', () => {
                const place = autoComplete.getPlace()
                console.log(place)
                setSelectedPlace(place.formatted_address)
                const position = place.geometry?.location

                if (position) {
                    setMarker(position, place.name)
                }
            })
        }
    }, [autoComplete])

    function setMarker(location, name) {
        if (!map) return

        map.setCenter(location)
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: location,
            title: "Marker"
        })

        const infoCard = new google.maps.InfoWindow({
            position: location,
            content: buildMapInfoCardContent(name, name), // change parameters later
            maxWidth: 200
        })

        infoCard.open({
            map: map,
            anchor: marker
        })
    }

    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            <input ref={placeAutoCompleteRef} />
            <p>{selectedPlace}</p>
            {isLoaded ?
                <div className="h-96 w-1/2 items-center" ref={mapRef} />
                : <p>Loading...</p>
            }
        </div>
    )
};