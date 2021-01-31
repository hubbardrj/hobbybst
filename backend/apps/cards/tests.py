from django.test import TestCase
from .models import Card

# Create your tests here.
class CardsModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        Card.objects.create(player_name='Michael Jordan')
        Card.objects.create(card_number='1 AF')
    
    def test_player_name_content(self):
        card = Card.objects.get(id=1)
        expected_object_name = f'{card.player_name}'
        self.assertEquals(expected_object_name, 'Michael Jordan')