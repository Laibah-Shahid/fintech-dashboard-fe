
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Check, X, CreditCard, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Pricing = () => {
  const { user, updateSubscription } = useAuth();
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    setSubscribing(tier);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update subscription in auth context
    updateSubscription(tier);
    
    setSubscribing(null);
  };

  const isCurrentPlan = (tier: string) => {
    return user?.subscriptionTier === tier;
  };

  return (
    <div className="min-h-screen bg-fintech-dark-purple text-white">
      {/* Header */}
      <header className="container mx-auto pt-10 pb-8 px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-fintech-purple text-white">
              <FileText className="h-5 w-5" />
            </div>
            <span className="ml-3 text-xl font-bold">FinAPI Sandbox</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-fintech-purple hover:bg-fintech-purple/90">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that best fits your development needs.
            All plans include access to our sandbox environment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <Card className={`flex flex-col ${isCurrentPlan("basic") ? "border-fintech-purple" : "border-white/10"} bg-secondary/30 backdrop-blur-sm`}>
            <CardHeader className="pb-8 pt-6">
              {isCurrentPlan("basic") && (
                <Badge className="mb-4 self-start bg-fintech-purple">
                  Current Plan
                </Badge>
              )}
              <CardTitle className="text-2xl">Basic</CardTitle>
              <CardDescription className="text-gray-400">
                Perfect for small projects
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Up to 1,000 API calls/month</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Basic transaction history</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Balance checking</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Fund transfers</span>
                </li>
                <li className="flex">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Advanced analytics</span>
                </li>
                <li className="flex">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Custom invoice generation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                className={`w-full ${
                  isCurrentPlan("basic")
                    ? "bg-secondary/50 hover:bg-secondary/70"
                    : "bg-fintech-purple hover:bg-fintech-purple/90"
                }`}
                disabled={isCurrentPlan("basic") || subscribing !== null}
                onClick={() => handleSubscribe("basic")}
              >
                {subscribing === "basic" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isCurrentPlan("basic") ? (
                  "Current Plan"
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className={`flex flex-col relative ${isCurrentPlan("pro") ? "border-fintech-purple" : "border-white/10"} bg-secondary/30 backdrop-blur-sm`}>
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <Badge className="bg-fintech-purple">Popular</Badge>
            </div>
            <CardHeader className="pb-8 pt-6">
              {isCurrentPlan("pro") && (
                <Badge className="mb-4 self-start bg-fintech-purple">
                  Current Plan
                </Badge>
              )}
              <CardTitle className="text-2xl">Professional</CardTitle>
              <CardDescription className="text-gray-400">
                For growing applications
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Up to 10,000 API calls/month</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Advanced transaction history</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Balance checking</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Fund transfers</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Custom invoice generation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                className={`w-full ${
                  isCurrentPlan("pro")
                    ? "bg-secondary/50 hover:bg-secondary/70"
                    : "bg-fintech-purple hover:bg-fintech-purple/90"
                }`}
                disabled={isCurrentPlan("pro") || subscribing !== null}
                onClick={() => handleSubscribe("pro")}
              >
                {subscribing === "pro" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isCurrentPlan("pro") ? (
                  "Current Plan"
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className={`flex flex-col ${isCurrentPlan("enterprise") ? "border-fintech-purple" : "border-white/10"} bg-secondary/30 backdrop-blur-sm`}>
            <CardHeader className="pb-8 pt-6">
              {isCurrentPlan("enterprise") && (
                <Badge className="mb-4 self-start bg-fintech-purple">
                  Current Plan
                </Badge>
              )}
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription className="text-gray-400">
                For serious applications
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Unlimited API calls</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Full transaction history</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Balance checking</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Fund transfers</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Custom invoice generation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                className={`w-full ${
                  isCurrentPlan("enterprise")
                    ? "bg-secondary/50 hover:bg-secondary/70"
                    : "bg-fintech-purple hover:bg-fintech-purple/90"
                }`}
                disabled={isCurrentPlan("enterprise") || subscribing !== null}
                onClick={() => handleSubscribe("enterprise")}
              >
                {subscribing === "enterprise" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isCurrentPlan("enterprise") ? (
                  "Current Plan"
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* FAQ Section */}
      <section className="container mx-auto py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">How does billing work?</h3>
              <p className="text-gray-300">
                All plans are billed monthly and you can upgrade or downgrade at any time.
                Changes take effect on your next billing cycle.
              </p>
            </div>
            <div className="bg-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Can I cancel my subscription?</h3>
              <p className="text-gray-300">
                Yes, you can cancel your subscription at any time. You'll have access to your current plan until the end of your billing period.
              </p>
            </div>
            <div className="bg-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Do you offer custom plans?</h3>
              <p className="text-gray-300">
                Yes, if you need a custom plan with specific requirements, please contact us and we'll work with you to create a tailored solution.
              </p>
            </div>
            <div className="bg-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">What happens if I exceed my API call limit?</h3>
              <p className="text-gray-300">
                If you exceed your monthly API call limit, additional calls will still be processed, but you'll be charged an overage fee.
                Consider upgrading to a higher tier if you regularly exceed your limit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30 py-8 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-fintech-purple text-white mr-2">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">FinAPI Sandbox</span>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} FinAPI Sandbox. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
