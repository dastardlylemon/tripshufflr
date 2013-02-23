import webapp2
import jinja2
import os

import json
import urllib2


import utils

API_KEY = 'AIzaSyBYnrYdbRZnpvoGfUblBdcOx9njmUL6lGY'
RADIUS = 1000

jinja_environment = jinja2.Environment(autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname	   (__file__), 'templates')))


def geocode(query):
	url = 'http://maps.googleapis.com/maps/api/geocode/json?address=%s&sensor=false' % (urllib2.quote(query))
	response = urllib2.urlopen(url)
	json_raw = response.read()
	json_data = json.loads(json_raw)

	if json_data['status'] != 'OK':
		return json_data['status']

	else:
		location = json_data['results'][0]['geometry']['location']
		return '%s,%s' % (location['lat'], location['lng'])

def nearbySearch(location, typeString):
	location = urllib2.quote(location)

	if location == None:
		return 'Location not found!'

	url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=%s&sensor=false&location=%s&radius=%s&types=%s' % (API_KEY, location, RADIUS, typeString)

	response = urllib2.urlopen(url)
	json_raw = response.read()
	json_data = json.loads(json_raw)

	if json_data["status"] != 'OK':
		return json_data["status"]

	#return json_data['results']
	return (json_data['results'], url)


def autocompleteSearch(keyword, location):
	#HTML escape the keyword
	keyword = urllib2.quote(keyword)

	if location == None:
		return 'Location not found!'

	url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=%s&location=%s&radius=%s&sensor=false&key=%s' % (keyword, location, RADIUS, API_KEY)
	response = urllib2.urlopen(url)
	json_raw = response.read()
	json_data = json.loads(json_raw)

	if json_data["status"] != 'OK':
		return json_data["status"]

	return json_data['predictions']


def textSearch(keyword, location, typeString):
	if location == None:
		return 'Location not found!'
	if keyword == None:
		return 'No keyword entered'

	url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?key=%s&query=%s&sensor=false&location=%s&radius=%s&types=%s' % (API_KEY, urllib2.quote(keyword), urllib2.quote(location), RADIUS, typeString)
	response = urllib2.urlopen(url)
	json_raw = response.read()
	json_data = json.loads(json_raw)

	if json_data["status"] != 'OK':
		return json_data["status"]

	return json_data['results']


def radarSearch(location, typeString):
	if location == None:
		return 'Location not found!'

	location = urllib2.quote(location)
	url = 'https://maps.googleapis.com/maps/api/place/radarsearch/json?key=%s&sensor=false&location=%s&radius=%s&types=%s' % (API_KEY, location, RADIUS, typeString)
	response = urllib2.urlopen(url)
	json_raw = response.read()
	json_data = json.loads(json_raw)

	if json_data["status"] != 'OK':
		return json_data["status"]

	return url



# def delete_duplicates(results):
# 	duplicateTypes = []
# 	nonDuplicates = []
# 	for result in results:
# 		duplicate = False
# 		typeList = result['types']
# 		for i in range(len(typeList)):
# 			if typeList[i] not in duplicateTypes:
# 				duplicateTypes.append(typeList[i])
# 				nonDuplicates.append(result)
# 				break;
# 	return nonDuplicates








class Handler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)
    
    def render_str(self, template, **params):
        t = jinja_environment.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))


class MainPage(Handler):
	def get(self):
		typeString = utils.typeStringFromParameter(self.request.get('typestring'))
		location = self.request.get('location')
		coords = geocode(location)
		search = nearbySearch(coords, typeString)
		results = search[0]
		url = search[1]

		#nearby = delete_duplicates(nearby)
		#text = textSearch(keyword, coords, typeString)
		#autocomplete = autocompleteSearch(keyword, coords)
		#radar = radarSearch(coords, typeString)
		self.render('index.html', nearbyPlaces= results, url=url)
	def post(self):
		self.redirect('/')


app = webapp2.WSGIApplication([('/', MainPage)],
                              debug=True)