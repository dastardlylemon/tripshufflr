def createTypeString(string):
	data = string.split()
	return '|'.join(data)

DEFAULT = createTypeString('zoo shopping_mall museum movie_theater aquarium art_gallery bicycle_store bowling_alley amusement_park park')

FOOD = createTypeString('bakery cafe food restuarant meal_delivery meal_takeaway ')

SHOPPING = createTypeString('shopping_mall store jewelry_store home_goods_store hair_care furniture_store florist clothing_store')

FEMININE = createTypeString('beauty_salon hair_care jewelry_store night_club spa')

ADULT = createTypeString('spa night_club liquor_store bar casino')

def typeStringFromParameter(param):
	if param == 'food': return FOOD
	elif param == 'adult': return ADULT
	elif param == 'feminine': return FEMININE
	elif param == 'shopping': return SHOPPING
	else: return DEFAULT


def localizer(L):
	if L == 'street_address': return 5*1600
	elif L == 'street_number': return 5*1600
	elif L == 'route': return 10*1600
	elif L == 'intersection':return 2*1600
	elif L == 'country': return 0
	elif L == 'administrative_area_level_1': return 50000 
	elif L == 'administrative_area_level_3': return 10*1600
	elif L == 'administrative_area_level_2': return 20 * 1600
	elif L == 'colloquial_area': return 10*1600
	elif L == 'locality': return 10*1600
	elif L == 'sublocality': return 5*1600
	elif L == 'neighborhood': return 1*1600
	elif L == 'premise': return 1*1600
	elif L == 'subpremise': return 1*1600
	elif L == 'postal_code': return 5*1600
	elif L == 'park': return 2*1600
	elif L == 'point_of_interest': return 5*1600

	else: return 10*1600


