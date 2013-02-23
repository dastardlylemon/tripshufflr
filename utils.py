def createTypeString(string):
	data = string.split()
	return '|'.join(data)

DEFAULT = createTypeString('zoo shopping_mall museum movie_theater aquarium art_gallery bicycle_store bowling_alley amusement_park')

FOOD = createTypeString('bakery cafe food restuarant meal_delivery meal_takeaway ')

SHOPPING = createTypeString('shopping_mall store jewelry_store home_goods_store hair_care furniture_store florist clothing_store')

FEMININE = createTypeString('beauty_salon hair_care jewelry_store night_club spa')

ADULT = createTypeString('spa night_club liquor_store bar casino')

def typeStringFromParameter(param):
	if param == 'food': return FOOD
	elif param == 'adult': return ADULT
	elif param == 'feminine': return feminine
	elif param == 'shopping': return shopping
	else: return DEFAULT



