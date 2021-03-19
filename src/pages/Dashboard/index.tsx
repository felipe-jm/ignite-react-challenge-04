import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

export type FoodType = {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
};

const Dashboard = () => {
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<FoodType>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.get("foods").then((response) => setFoods(response.data));
  }, []);

  const handleAddFood = async (food: FoodType) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodType) => {
    try {
      if (!editingFood) return;

      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleEditFood = (food: FoodType) => {
    setEditingFood(food);
  };

  return (
    <>
      <Header openModal={toggleModal} />

      <ModalAddFood
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        handleAddFood={handleAddFood}
      />

      <ModalEditFood
        isOpen={!!editingFood}
        onRequestClose={() => setEditingFood(undefined)}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
