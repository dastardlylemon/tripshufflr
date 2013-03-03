import webapp2
import jinja2
import os

import json
import urllib2
import random


import utils

API_KEY = 'AIzaSyBgGKN50nfIOuQnVgPpM6sFCYhAGsiwayU'
PHOTO_URL = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&sensor=true&key=%s&photoreference=' % (API_KEY)
RADIUS = 10000

jinja_environment = jinja2.Environment(autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname	   (__file__), 'templates')))


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













def geocode(query):
	query = urllib2.quote(query)
	url = 'http://maps.googleapis.com/maps/api/geocode/json?address=%s&sensor=false' % (query)
	response = urllib2.urlopen(url)
	json_raw = response.read()
	json_data = json.loads(json_raw)

	if json_data['status'] != 'OK':
		return json_data['status']

	else:
		location = json_data['results'][0]['geometry']['location']
		return ('%s,%s' % (location['lat'], location['lng']), json_data['results'][0]['address_components'][0]['types'])




def nearbySearch(location, typeString, radius):
	location = urllib2.quote(location)

	url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=%s&sensor=false&location=%s&radius=%s&types=%s' % (API_KEY, location, radius, typeString)

	response = urllib2.urlopen(url)
	json_raw = response.read()
	json_data = json.loads(json_raw)

	if json_data["status"] != 'OK':
		return ({}, url)

	#return json_data['results']
	return (json_data['results'], url)




def delete_duplicates(results):
	#deletes duplicates of multiple stuff
	duplicateTypes = []
	nonDuplicates = []
	for result in results:
		typeList = result['types']
		for i in range(len(typeList)):
			if typeList[i] not in duplicateTypes:
				duplicateTypes.append(typeList[i])
				nonDuplicates.append(result)
				break;
	return nonDuplicates


def filterType(results, typeString):
	# return ref_ids for a type out of a results list
	random.shuffle(results)
	ref_ids = []
	for result in results:
		typeList = result['types']
		for t in typeList:
			if t in typeString:
				ref_ids.append(result['reference'])
				break;
	return ref_ids

def filterOnlyType(results, typeString):
	random.shuffle(results)
	ref_ids = []
	for result in results:
		flag = True
		for t in result['types']:
			if t not in typeString:
				flag = False
		if flag == True:
			ref_ids.append(result['reference'])
	return ref_ids

def removeType(results, typeString):
	for result in results:
		for t in result['types']:
			if t in typeString:
				results.remove(result)
	return results


def getDetails(ref_id):
	url = 'https://maps.googleapis.com/maps/api/place/details/json?&sensor=false&reference=%s&key=%s' % (ref_id, API_KEY)

	response = urllib2.urlopen(url)
	json_raw = response.read()
	json_data = json.loads(json_raw)

	if json_data["status"] != 'OK':
		return ([], json_data['status'])

	result = json_data['result']

	return (result, json_data['status'])


def getDetailsList(amount, ref_ids):
	results = []
	for i in range(amount):
		results.append(getDetails(ref_ids[i])[0])
	return results

def getPhotoID(results):
	for result in results:
		if "photos" in result:
			return random.choice(result['photos'])['photo_reference']
	return False

def photoURL(ref_id):
	if not ref_id:
		return 'img/placeholder.jpg'

	return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=%s&sensor=true&key=%s' % (ref_id, API_KEY)


def addDefaultPhoto(results):
	for result in results:
		if not("photos" in result):
			result['photos'] = [{'photo_reference': 'img/placeholder'}]
	return results
 



class Handler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)
    
    def render_str(self, template, **params):
        t = jinja_environment.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))


class TestPage(Handler):
	def get(self):
		typeString = utils.typeStringFromParameter(self.request.get('typestring'))
		location = self.request.get('location')
		geocode_results = geocode(location)
		coords = geocode_results[0]
		radius = utils.localizer(geocode_results[1][0])
		search = nearbySearch(coords, typeString, radius)
		results = search[0]

		random.shuffle(results) # to get different order everytime
		results = delete_duplicates(results)
		
		url = search[1]

		#nearby = delete_duplicates(nearby)
		#text = textSearch(keyword, coords, typeString)
		#autocomplete = autocompleteSearch(keyword, coords)
		#radar = radarSearch(coords, typeString)
		self.render('test.html', nearbyPlaces= results, url=url, radius=str(radius) + str(geocode_results[1]))
	def post(self):
		self.redirect('/')

class itineraryPage(Handler):
	def get(self):
		typeString = utils.DEFAULT + '|' + utils.FOOD
		location = self.request.get('location')

		geocode_results = geocode(location)
		coords = geocode_results[0]
		radius = utils.localizer(geocode_results[1][0])

		firstsearch = nearbySearch(coords, typeString, 50000)[0]
		food = filterType(firstsearch, utils.FOOD)
		fun = filterType(firstsearch, utils.DEFAULT)

		if len(food) >= 3:
			meals = getDetailsList(3, food)
		else:
			meals = ()

		if len(fun) >= 3:
			activities = getDetailsList(3, fun)
		else:
			activities = ()

		photoref_id = getPhotoID(firstsearch)

		self.render('day.html', radius = radius, meals = meals, activities = activities, photo = photoref_id)
	def post(self):
		self.redirect('/')



class TitlePage(Handler):
	def get(self):
		error = self.request.get('error')
		self.render('index.html', error = error)
	def post(self):
		query = self.request.get('main-search')
		self.redirect('/day?query=%s' % (query))

class DayPlanner(Handler):
	def get(self):
		typeString = utils.DEFAULT + '|' + utils.FOOD
		location = self.request.get('query')

		geocode_results = geocode(location)
		coords = geocode_results[0]
		radius = utils.localizer(geocode_results[1][0])

		firstsearch = nearbySearch(coords, typeString, radius)[0]
		food = filterType(firstsearch, utils.FOOD)
		fun = filterType(firstsearch, utils.DEFAULT)

		length = 3
		if len(food) >= length:
			meals = getDetailsList(length, food)
		else:
			meals = []

		if len(fun) >= length:
			activities = getDetailsList(length, fun)
		else:
			activities = []

		photoref_id = getPhotoID(firstsearch)
		if len(meals) > 0 or len(activities) > 0:
			self.render('results.html', meals = meals, photo = photoref_id, location = location, places = activities, photo_url= PHOTO_URL)
		else:
			self.redirect('/?error=%s' % ("No matches for given location, please try again."))


	def post(self):
		typeString = utils.DEFAULT + '|' + utils.FOOD
		location = self.request.get('query')

		geocode_results = geocode(location)
		coords = geocode_results[0]
		radius = utils.localizer(geocode_results[1][0])

		firstsearch = nearbySearch(coords, typeString, radius)[0]
		food = filterType(firstsearch, utils.FOOD)
		fun = filterType(firstsearch, utils.DEFAULT)

		length = 3
		if len(food) >= length:
			meals = getDetailsList(length, food)
		else:
			meals = []

		if len(fun) >= length:
			activities = getDetailsList(length, fun)
		else:
			activities = []

		photoref_id = getPhotoID(firstsearch)
		if len(meals) > 0 or len(activities) > 0:
			self.render('results.html', meals = meals, photo = photoref_id, location = location, places = activities, photo_url= PHOTO_URL)
		else:
			self.redirect('/')

class ListPage(Handler):
	def get(self):
		activity_type = self.request.get('typestring')
		typeString = utils.typeStringFromParameter(activity_type)
		location = self.request.get('query')

		geocode_results = geocode(location)
		coords = geocode_results[0]
		radius = utils.localizer(geocode_results[1][0])

		places = nearbySearch(coords, typeString, radius)[0]

		photoref_id = getPhotoID(places)

		if (activity_type == 'default'):
			activity_type = 'Adventures'

		if len(places) > 0:
			self.render('broad_results.html', location = location, activity_type= activity_type, places = places, photo = photoref_id, photo_url = PHOTO_URL)
		else:
			self.redirect('/')

	def post(self):
		typeString = utils.DEFAULT + '|' + utils.FOOD
		location = self.request.get('query')

		geocode_results = geocode(location)
		coords = geocode_results[0]
		radius = utils.localizer(geocode_results[1][0])

		firstsearch = nearbySearch(coords, typeString, radius)[0]
		food = filterType(firstsearch, utils.FOOD)
		fun = filterType(firstsearch, utils.DEFAULT)

		length = 3
		if len(food) >= length:
			meals = getDetailsList(length, food)
		else:
			meals = []

		if len(fun) >= length:
			activities = getDetailsList(length, fun)
		else:
			activities = []

		photoref_id = getPhotoID(firstsearch)
		if len(meals) > 0 or len(activities) > 0:
			self.render('results.html', meals = meals, photo = photoref_id, location = location, places = activities, photo_url= PHOTO_URL)
		else:
			self.redirect('/?error=%s' % ("No matches for given location, please try again."))

app = webapp2.WSGIApplication([('/test', TestPage),
								('/itinerary', itineraryPage),
								('/', TitlePage),
								('/day', DayPlanner),
								('/broad', ListPage)],
                              debug=True)