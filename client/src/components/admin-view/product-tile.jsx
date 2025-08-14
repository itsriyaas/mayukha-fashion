import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({ product = {}, onEdit, handleDelete }) {
  // Clean defaults to prevent undefined issues
  const safeProduct = {
    _id: product?._id || null,
    title: product?.title || "Untitled Product",
    image: product?.image || "/placeholder.png",
    sizes: Array.isArray(product?.sizes) ? product.sizes : [],
    price: Number(product?.price) || 0,
    salePrice: Number(product?.salePrice) || 0,
    ...product // preserve all original fields
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-lg">
      {/* Product Image */}
      <div className="relative w-full h-[300px] bg-gray-50">
        <img
          src={safeProduct.image}
          alt={safeProduct.title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent>
        {/* Title */}
        <h2 className="text-xl font-bold mb-2 mt-2 truncate">
          {safeProduct.title}
        </h2>

        {/* Sizes */}
        {safeProduct.sizes.length > 0 && (
          <div className="mb-2">
            <span className="font-medium text-sm">Sizes: </span>
            <span className="text-sm text-gray-700">
              {safeProduct.sizes.join(", ")}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              safeProduct.salePrice > 0 ? "line-through" : ""
            } text-lg font-semibold text-primary`}
          >
            ₹{safeProduct.price}
          </span>
          {safeProduct.salePrice > 0 && (
            <span className="text-lg font-bold text-green-600">
              ₹{safeProduct.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex justify-between items-center border-t pt-3">
        <Button onClick={() => onEdit(safeProduct)}>Edit</Button>
        <Button
          variant="destructive"
          disabled={!safeProduct._id}
          onClick={() => handleDelete(safeProduct._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;
