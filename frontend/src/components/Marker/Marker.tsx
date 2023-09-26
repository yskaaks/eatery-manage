import { Eatery } from '../../interface';
import "./Marker.css"

interface MarkerProps {
  eatery: Eatery, 
  map: google.maps.Map, 
  infoWindow: google.maps.InfoWindow, 
  navigate: Function
  distance: any, 
  image: any, 
  measurementUnit: any,
}

export async function createMarker(props: MarkerProps) {
  const { eatery, map, infoWindow, navigate, distance, image, measurementUnit } = props;

  const icon = {
    url: "/src/assets/marker.png",
    scaledSize: new google.maps.Size(40, 40), // this can be changed to whatever size you need.
  }
  const marker = new google.maps.Marker({
    map,
    position: { lat: eatery.latitude, lng: eatery.longitude },
    icon: icon
  });


  let imageDiv = "";
  if (image) {
    imageDiv = `<div class="marker-image" style="background-image: url(${image});"></div>`;
  } else {
    imageDiv = `<div class="marker-image-default"><i class="glyphicon glyphicon-picture"> </i></div>`; // default div
  }

  const contentString = 
  `<div id="content" class="marker-content-wrapper"> 
    ${imageDiv}
    <div class="marker-content"> 
      <h5 class="marker-title">${eatery.restaurant_name}</h5>
      <p class="distance"> ${distance}${measurementUnit} away</p>
    </div>
    </div>
  </div>`;

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(contentString);
    infoWindow.open(map, marker);
    

    google.maps.event.addListenerOnce(infoWindow, 'domready', function () {
      document.getElementById('content')?.addEventListener('click', () => {
        navigate(`/restaurant/${eatery.id}`);
      });
    });
  });
  return marker;
}

