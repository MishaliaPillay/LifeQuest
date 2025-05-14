import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Select,
  message,
  Spin,
  List,
  Card,
  Tag,
  Alert,
} from "antd";
import {
  useMealActions,
  useMealState,
} from "@/providers/health-path-provider/meal-provider";
import {
  IMeal,
  IGenerateMealRequest,
} from "@/providers/health-path-provider/meal-provider/context";

const { Title, Text } = Typography;
const { Option } = Select;

const Meals: React.FC<{
  onMealsGenerated: (meals: IMeal[]) => void;
}> = ({ onMealsGenerated }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { generateMeals } = useMealActions();
  const { meals, isPending, isError, errorMessage } = useMealState();
  const previousMealsRef = useRef<IMeal[]>([]);

  useEffect(() => {
    if (
      meals &&
      meals.length > 0 &&
      JSON.stringify(previousMealsRef.current) !== JSON.stringify(meals)
    ) {
      onMealsGenerated(meals);
      previousMealsRef.current = meals;
    }
  }, [meals, onMealsGenerated]);

  const handleFinish = async (values: IGenerateMealRequest) => {
    setSubmitting(true);
    try {
      const request = {
        dietaryRequirement: values.dietaryRequirement,
        preferredCuisine: values.preferredCuisine,
        mealType: values.mealType,
        maxCalories: values.maxCalories,
      };

      await generateMeals(request);
      message.success("Meals generated successfully!");
    } catch (error) {
      console.error("Error generating meals:", error);
      message.error("Failed to generate meals.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Title level={3}>Generate Your Personalized Meal Plan</Title>
      <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
        Tell us your preferences to get meal suggestions tailored for you.
      </Text>

      {isError && errorMessage && (
        <Alert
          message="Error"
          description={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        initialValues={{
          dietaryRequirement: "none",
          preferredCuisine: "italian",
          mealType: "lunch",
          maxCalories: 500,
        }}
      >
        <Form.Item
          name="dietaryRequirement"
          label="Dietary Requirement"
          rules={[{ required: true, message: "Please select a dietary need" }]}
        >
          <Select placeholder="Select dietary requirement">
            <Option value="none">None</Option>
            <Option value="vegetarian">Vegetarian</Option>
            <Option value="vegan">Vegan</Option>
            <Option value="gluten-free">Gluten-Free</Option>
            <Option value="keto">Keto</Option>
            <Option value="halal">Halal</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="preferredCuisine"
          label="Preferred Cuisine"
          rules={[{ required: true, message: "Please choose a cuisine" }]}
        >
          <Select placeholder="Choose a cuisine">
            <Option value="italian">Italian</Option>
            <Option value="mexican">Mexican</Option>
            <Option value="indian">Indian</Option>
            <Option value="chinese">Chinese</Option>
            <Option value="japanese">Japanese</Option>
            <Option value="mediterranean">Mediterranean</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="mealType"
          label="Meal Type"
          rules={[{ required: true, message: "Please choose a meal type" }]}
        >
          <Select placeholder="Select meal type">
            <Option value="breakfast">Breakfast</Option>
            <Option value="lunch">Lunch</Option>
            <Option value="dinner">Dinner</Option>
            <Option value="snack">Snack</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="maxCalories"
          label="Maximum Calories"
          rules={[{ required: true, message: "Please enter a calorie limit" }]}
        >
          <Input type="number" min={100} max={1500} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting || isPending}
          >
            Generate Meals
          </Button>
        </Form.Item>
      </Form>

      {isPending ? (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: "10px" }}>
            Generating your personalized meals...
          </Text>
        </div>
      ) : (
        meals.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <Title level={4}>Your Personalized Meals</Title>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
              dataSource={meals}
              renderItem={(meal) => (
                <List.Item>
                  <Card
                    title={meal.name}
                    extra={<Tag color="cyan">Calories: {meal.calories}</Tag>}
                    size="small"
                  >
                    <p>{meal.description}</p>
                    <p>
                      <b>Calories:</b> {meal.calories}
                    </p>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )
      )}
    </div>
  );
};

export default Meals;
