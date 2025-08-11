import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  onEdit,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>

          {/* Show all sizes as comma-separated list */}
          {product?.sizes?.length > 0 && (
            <div className="mb-2">
              <span className="font-medium text-sm">Sizes: </span>
              <span className="text-sm text-gray-700">
                {product.sizes.join(", ")}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold">₹{product?.salePrice}</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Button onClick={() => onEdit(product)}>Edit</Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(product?._id)}
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
