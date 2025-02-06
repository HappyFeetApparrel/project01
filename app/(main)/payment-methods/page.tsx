import PaymentMethods from "./components/payment-methods";

// right sidebar
import SupplierAnalytics from "@/components/supplier-analytics";
import QuickActions from "../dashboard/components/QuickActions";

// types
// providers
import { PaymentMethodProvider } from "./provider/payment-method-provider";

const PaymentMethodsPage = () => {
  return (
    <div className="py-16 px-8 space-y-8 grid grid-cols-1 xl:grid-cols-3">
      <div className="p-0 lg:p-6 space-y-6 col-span-1 xl:col-span-2">
        <PaymentMethodProvider>
          <PaymentMethods />
        </PaymentMethodProvider>
      </div>
      <div className="col-span-1 p-0 lg:p-4 mx:p-8 flex xl:block items-start gap-8 flex-col-reverse sm:flex-row">
        <QuickActions />
        <SupplierAnalytics />
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
