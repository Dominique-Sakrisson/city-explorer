require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const { formatLocationResponse, mungeReviewResponse, mungeWeatherResponse } = require('../lib/munger-functions.js');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('should return some munged review data', async() => {

      const expectation = [
        {
          "name": "Owens Fish Camp",
          "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/cIEYVhc7dMB-vIh_Tvv9gQ/o.jpg",
          "price": "$$",
          "rating": 4.5,
          "url": "https://www.yelp.com/biz/owens-fish-camp-sarasota?adjust_creative=iB-g85KitIPLvFXHo4hWFg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iB-g85KitIPLvFXHo4hWFg"
        }
      ];

      const mungie ={
        "businesses": [
            {
                "id": "USq57A18KfPeheWDfFzVkA",
                "alias": "owens-fish-camp-sarasota",
                "name": "Owens Fish Camp",
                "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/cIEYVhc7dMB-vIh_Tvv9gQ/o.jpg",
                "is_closed": false,
                "url": "https://www.yelp.com/biz/owens-fish-camp-sarasota?adjust_creative=iB-g85KitIPLvFXHo4hWFg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iB-g85KitIPLvFXHo4hWFg",
                "review_count": 1656,
                "categories": [
                    {
                        "alias": "seafood",
                        "title": "Seafood"
                    }
                ],
                "rating": 4.5,
                "coordinates": {
                    "latitude": 27.3319,
                    "longitude": -82.53974
                },
                "transactions": [
                    "delivery"
                ],
                "price": "$$",
                "location": {
                    "address1": "516 Burns Ln",
                    "address2": "",
                    "address3": "",
                    "city": "Sarasota",
                    "zip_code": "34236",
                    "country": "US",
                    "state": "FL",
                    "display_address": [
                        "516 Burns Ln",
                        "Sarasota, FL 34236"
                    ]
                },
                "phone": "+19419516936",
                "display_phone": "(941) 951-6936",
                "distance": 1029.578186539982
            }
        ]
      }
     
      const actual = mungeReviewResponse(mungie);
      expect(actual).toEqual(expectation);
    });
    test('should return some munged review data', async() => {

      const expectation = [
        
        {
          "forecast": "Light rain",
          "time": "Sun Feb 28 2021"
      }
      ];

      const mungie ={
        data: [
          {
              "moonrise_ts": 1614646122,
              "wind_cdir": "WSW",
              "rh": 71,
              "pres": 994.6042,
              "high_temp": 14.4,
              "sunset_ts": 1614640142,
              "ozone": 268.34897,
              "moon_phase": 0.861729,
              "wind_gust_spd": 13.6953125,
              "snow_depth": 0,
              "clouds": 80,
              "ts": 1614574860,
              "sunrise_ts": 1614599100,
              "app_min_temp": -0.1,
              "wind_spd": 3.2052507,
              "pop": 90,
              "wind_cdir_full": "west-southwest",
              "slp": 1012.5208,
              "moon_phase_lunation": 0.61,
              "valid_date": "2021-03-01",
              "app_max_temp": 14.4,
              "vis": 19.1675,
              "dewpt": 3.7,
              "snow": 0,
              "uv": 2.317366,
              "weather": {
                  "icon": "r01d",
                  "code": 500,
                  "description": "Light rain"
              }
            }
        ]
      }
     
      const actual = mungeWeatherResponse(mungie);
      expect(actual).toEqual(expectation);
    });

    test('should return some munged review data', async() => {

      const expectation = 
      {
          "formatted_query": "Portland, Multnomah, Oregon, USA",
          "latitude": "45.5202471",
          "longitude": "-122.6741949"
      };

      const mungie =[
          {
            "place_id": "282983082",
            "licence": "https://locationiq.com/attribution",
            "osm_type": "relation",
            "osm_id": "186579",
            "boundingbox": [
                "45.432536",
                "45.6528812",
                "-122.8367489",
                "-122.4720252"
            ],
            "lat": "45.5202471",
            "lon": "-122.6741949",
            "display_name": "Portland, Multnomah, Oregon, USA",
            "class": "place",
            "type": "city",
            "importance": 0.753565717433768,
            "icon": "https://locationiq.org/static/images/mapicons/poi_place_city.p.20.png"
        },
        {
            "place_id": "236025890",
            "licence": "https://locationiq.com/attribution",
            "osm_type": "relation",
            "osm_id": "132500",
            "boundingbox": [
                "43.5443477",
                "43.7276965",
                "-70.3473997",
                "-69.9758509"
            ],
            "lat": "43.6610277",
            "lon": "-70.2548596",
            "display_name": "Portland, Cumberland County, Maine, USA",
            "class": "place",
            "type": "city",
            "importance": 0.65297101392868,
            "icon": "https://locationiq.org/static/images/mapicons/poi_place_city.p.20.png"
        }
      ]
        
     
      const actual = formatLocationResponse(mungie);
      expect(actual).toEqual(expectation);
    });

  });
});
