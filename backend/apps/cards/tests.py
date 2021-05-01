from backend.apps.sportdata.models import Player, Team
from django.test import TestCase
from .models import Card, Brand

# Create your tests here.
class CardsModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        Brand.objects.create(name='Brand A')
        Team.objects.create()
        Player.objects.create(name='Brand A')
        
    
    # def test_player_name_content(self):
    #     card = Card.objects.get(id=1)
    #     expected_object_name = f'{card.player_name}'
    #     self.assertEquals(expected_object_name, 'Michael Jordan')
    
    # def test_card_create(self):
    #     Card.objects.create(
    #         brand = {name="Brand A"}
    #         player = models.ForeignKey(Player, null=True, on_delete=models.SET_NULL)
    #         card_number = models.CharField(max_length=20, null=False)
    #         set_name = models.CharField(max_length=200)
    #         set_year = models.IntegerField()
    #         team = models.ForeignKey(Team, null=True, on_delete=models.SET_NULL)
    #         user = models.ForeignKey(User, on_delete=models.CASCADE))

