import axios from 'axios';
// starting point
const GOOGLE_AMP_API = 'ENTER API HERE';

type GoogleResType = {
	results: {
		geometry: {
			location: {
				lat: number;
				lng: number;
			};
		};
	}[];
	status: 'OK' | 'ZERO_RESULTS';
};

const form = document.getElementById('form')! as HTMLFormElement;
const input = document.getElementById('address')! as HTMLInputElement;

form.addEventListener('submit', (event) => {
	event.preventDefault();

	const address = input.value;

	axios
		.get<GoogleResType>(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
				address
			)}&key=${GOOGLE_AMP_API}`
		)
		.then((res) => {
			if (res.data.status !== 'OK') {
				throw new Error('No Location Found!');
			}
			const location = res.data.results[0].geometry.location;
			console.log({ location, res });

			const map = new google.maps.Map(document.getElementById('map')!, {
				center: location,
				zoom: 10,
			});

			new google.maps.Marker({
				position: location,
				map,
			});
		})
		.catch((err) => {
			alert(err.message);
			console.error({ err });
		});
});

export const initMap = () => {
	console.log({ message: 'google map is loaded.' });
};
