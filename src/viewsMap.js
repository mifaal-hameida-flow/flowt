import HomeView from './views/HomeView.vue'
import RestaurantDetailsView from './views/RestaurantDetailsView.vue'
import RecommendedView from './views/RecommendedView.vue'
import DishDetails from './views/DishDetails.vue'
import PersonalArea from './views/PersonalArea.vue'
import FinishLine from './views/FinishLine.vue'

export const views = {
  HomeView,
  RestaurantDetailsView,
  RecommendedView,
  DishDetails,
  PersonalArea,
  FinishLine
}

export function getCurrentViewComponent(step) {
  if (step >= 2 && step < 4) return views.RestaurantDetailsView
  if (step === 4) return views.RecommendedView
  if (step === 5) return views.RestaurantDetailsView
  if (step >= 6 && step < 9) return views.DishDetails
  if (step >= 9 && step < 11) return views.PersonalArea
  if (step >= 11 && step < 13) return views.RecommendedView
  if (step >= 13) return views.FinishLine
  return views.HomeView
}
