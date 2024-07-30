import PageHeaders from "../../components/PageHeaders";

// export default function pricingPage(){
//     return(
//     <>   
//     <PageHeaders 
//     h1Text="Take a look at our pricing!" 
//     h2Text="PS: It's free forever! ;)"/>
//     <h1 className="text-center text-4xl mt-20"style={{textShadow: '3px 3px rgba(0,0,0,.1)'}}>
//         You don't even need to login to use our services!
//     </h1>
//     </> 
//     );

// }
export default function PricingPage() {
    return (
        <>   
            <div className="container mx-auto mt-20 text-center">
                <h1 className="text-4xl font-bold" style={{ textShadow: '3px 3px rgba(0,0,0,.1)' }}>
                    You don&apos;t even need to login to use our services!
                </h1>
                <p className="mt-6 text-lg text-gray-600">
                    Enjoy unlimited access to all features without any cost.
                </p>
            </div>
            <div className="container mx-auto mt-10">
                <div className="flex justify-center items-center">
                    {/* Free Plan */}
                    <div className="border rounded-lg shadow-lg p-6 w-full md:w-80 flex-grow flex flex-col text-center">
                        <h2 className="text-2xl font-semibold mb-4">Current Plan</h2>
                        <p className="text-3xl font-bold mb-4">$0 <span className="text-xl font-normal">/month</span></p>
                        <ul className="text-left space-y-2 flex-grow">
                            <li>Unlimited access</li>
                            <li>All features included</li>
                            <li>Email support</li>
                        </ul>
                        <p className="mt-4 text-lg text-gray-600">
                            Pricing options will be available soon.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
// export default function PricingPage() {
//     return (
//         <>   
//             <div className="container mx-auto mt-20 text-center">
//                 <h1 className="text-4xl font-bold" style={{ textShadow: '3px 3px rgba(0,0,0,.1)' }}>
//                     You don't even need to login to use our services!
//                 </h1>
//                 <p className="mt-6 text-lg text-gray-600">
//                     Enjoy unlimited access to all features without any cost.
//                 </p>
//             </div>
//             <div className="container mx-auto mt-10">
//                 <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
//                     {/* Free Plan */}
//                     <div className="border rounded-lg shadow-lg p-6 w-full md:w-80 flex-grow flex flex-col">
//                         <h2 className="text-2xl font-semibold mb-4">Free Plan</h2>
//                         <p className="text-3xl font-bold mb-4">$0 <span className="text-xl font-normal">/month</span></p>
//                         <ul className="text-left space-y-2 flex-grow">
//                             <li>Unlimited access</li>
//                             <li>Basic features</li>
//                             <li>Email support</li>
//                         </ul>
//                         <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Choose Plan</button>
//                     </div>
//                     {/* Pro Plan */}
//                     <div className="border rounded-lg shadow-lg p-6 w-full md:w-80 flex-grow flex flex-col">
//                         <h2 className="text-2xl font-semibold mb-4">Pro Plan</h2>
//                         <p className="text-3xl font-bold mb-4">$9.99 <span className="text-xl font-normal">/month</span></p>
//                         <ul className="text-left space-y-2 flex-grow">
//                             <li>Everything in Free</li>
//                             <li>Advanced features</li>
//                             <li>Priority support</li>
//                         </ul>
//                         <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Choose Plan</button>
//                     </div>
//                     {/* Enterprise Plan */}
//                     <div className="border rounded-lg shadow-lg p-6 w-full md:w-80 flex-grow flex flex-col">
//                         <h2 className="text-2xl font-semibold mb-4">Enterprise Plan</h2>
//                         <p className="text-3xl font-bold mb-4">Contact us</p>
//                         <ul className="text-left space-y-2 flex-grow">
//                             <li>Custom features</li>
//                             <li>Dedicated support</li>
//                             <li>Service Level Agreement (SLA)</li>
//                         </ul>
//                         <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Contact Us</button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

