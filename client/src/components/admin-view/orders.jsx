import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-3 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">All Orders</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        {/* ✅ Make table scrollable & responsive */}
        <div className="overflow-x-auto w-full">
          <Table className="w-full min-w-[700px] sm:min-w-0">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                  Order ID
                </TableHead>
                <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                  Order Date
                </TableHead>
                <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                  Order Status
                </TableHead>
                <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                  Order Price
                </TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow key={orderItem?._id}>
                      <TableCell className="text-xs sm:text-sm break-words">
                        {orderItem?._id}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                        {orderItem?.orderDate.split("T")[0]}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          className={`py-0.5 px-2 text-xs sm:text-sm ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-black"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                        ₹{orderItem?.totalAmount}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            size="sm"
                            className="text-xs sm:text-sm"
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            View Details
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
