# From Analysis to Microservice Specifications 
## Goals and outline of section 
This section describes the design step which uses output from the event storming session and subsequent analysis and derives a set of micro services design specification.
The goals for ts design step and the resulting specifications are: 
* Highly modular cloud native microservices 
* Event coupled microservices -  facilitating independent modification and evolution of each microservice separatelys
* Allow for event sourcing – eventual correctness and recovery using event base) 
* Illustrate CQRS and its scaling advantages 

Since we are delivering a demonstration application there will be some simulator / scaffolding / testing services mixed in with the required business processing.
This is a common occurrence in agile development and it may be helpful to show how decision to scope and simplify a particular build and test step interact with decisions relating strictly to microservices design.  

Requirements for scalability, coupling of microservices *only* through the event back bone and eventual correctness   differentiate this step from previous Event Storming and Domain Driven Design activities which were 100% business requirement driven.

## Starting materials generated during Event Storming and Analysis
In this microservices specification step we make use of the following materials generated during Event Storming and analysis of the Container Shipment example problem: 
* Event Sequence flow
* Events – business description
* Critical events 
* Aggregates and services  
   * Users – roles user stories 
   * Commands
   * Event linkages
   * Policies 
   * Event prediction and probability flows 
* Data  ( Conceptual ) 
The derivation of these material was described in: [Analysis](../analysis/readme.md) .

## Event linked microservices design - structure 
A complete microservices specification ( the target of this design step ) will include specifications of the following: 
* Event Topics 
   * Used to configure the Kafka Event Backbone 
* Event types within each event topic 
* Microservices: 
   * These are finer grained than aggregates 
   * May separate query and command; possibly multiple queries  
   * May Separate whether simulation or business processing component 
   * Demonstration Control –main UI 
   * Scaffolding and testing services  - whether local and cloud versions 
* Microservice specification ( for each identified 
   * Data within Each microservice
   * APIs  ( Synchronous ) 
   * Topics and events Subscribed to
   * Events published / emitted   
* List of end to end interactions 
   * List of logic segments per microservice 
* Recovery processing, scaling 
   * We expect this to be highly patterned and template driven not requiring example-specific design 
With the above information coding of each microservice and other components of the sprint should be straightforward.    


## Steps in the design process 
Here we describe in generic terms, each step in the process of deriving event-linked microservice specification. In following section we will describe in more detail how each of these steps plays out in the specific context of the the container shippment example.

### List of generic steps:
*  **Step 1 - limit the context and scope for this particular build / sprint** 
   * we assume that we are developing a particular build for a sprint within some agile development ; additional functions and complexity may be added in later sprints
   * working from the initial list of aggregates, select which aggregates will be included in this build
   * for each aggregate possible choices are: (1) to completely skip and workaround the aggregate in this build (2) to include a full lifecycle implementation of the aggregate (3) to provide a simplified lifecycle implementation - typicall a table of entities is initialized at s.  tart up, and state changes to existing entities are tracked 
   * determine whether there are simulation services or predictive analytics service to be included in the build 
   * identify the external query apis and command apis which this build will support 
   * create entity lifecycle diagrams for entites having a full lifecycle implementation in this build / sprint .
*  **Step 2 -    identify specific microservices in each aggregate**
   *  each aggregate will be implemented as some composition of (1) a command microservice managing state chsnges to the entities in this aggregate (2) possibly one or more separate ( CQRS) query services providing internal or external API query capabilities (3) additional simulation, predictive analytics or User Interface microservices 
   * The command microservice will be built around and manage a collection of active entites for the aggregate, keyed by some primary key
   * The separation of each aggregate into specific component microservices as outlined above, will be a complete list of microservices for the build / sprint. 
   * Identify the data collections, and collection organization (keying structure)  in each command and query microservice for this build.
*  **Step 3 -  generate microservice interaction diagrams for the build** 
   * The diagram will show API calls initiating state change 
   * It shows for each interaction whether this is a synchronous API calls or an asynchronous event interaction via the event backbone
   * The diagram labels each specific event interaction between microservices trigerring a state change
   * ( Typically queries are synchronous API calls since the caller cannot usefully proceeed until a result is returned )
   * From this we can extract: (1)  a complete  list of event types on each topic, with information passed on each event type (2) the complete list of “logic segments” for each microservice processing action in response to an API call or initiating event 
   * When, at the next level of detail, the individual fields in each event are specified and typed, the CloudEvents standard  in https://github.com/cloudevents/spec should be assumed as a start point 
*  **Step 4 - specify recovery approach in case a microservice fails**
   * If a microservice fails it will need to recover its internal state date by resubscribing to one or more topics on the event bus  
   * In general, commamd and query microservices will have a standard pattern for doing this 
   * Any custom event filtering and service specific logic should be specified 

### Concepts and rationale underlying this design approach
* What is the difference between event information stored in the event backbone and state data stored in the microservices ?
   * the event information stored persistently in the event backbone is organized by topic and, within each topic, entirely by event time-of-occurrence.
   * the state information in a command microservice is a list (collection) of  all **currently active** entities of the owning aggregate ( e.g. all orders, all voyages etc ) and the **current** state of each such entity 
   * each command microservice will consist of a collection of entity records keyed by primary key 
   * this is complementary to the historically organized information in the event backbone. 
* When is it OK to be using synchronous interactions between services instead of asyncrhonous event interacts through the event backbone?
    * For non-state-changing queries, for which the response is always instantaneously available a synchronous query callmy be Ok and will provide a simpler more understandable interface.
    * Any processing which can be though of as being triggered by some state change in anothe aggregate should be modelled with an asynchronous, because as the solution eveolves other new microservices may also need to be aware of this event. We do not want to have to go back and change logic n the service where this event originated to have that microservice actively report the event to all potential consumers. 
*   How do we save microservices from having to maintain data collections with complex secondary indexing for which eventual consistency will be hard to implement? 
    * Each command  microservice should do all its state changing updates using the primary key lookup only for its entities.
    * Each asynchronous event interaction between microservices should carry primary entityIds ( orderID, VoyageID, shipID) for any entities associated with the interaction.
    * Each query which might require speciaoized secondary indexing to respond to queries can be implemented in a separate CQRS query service which subscribes to events  to do all internal updating and receives events from the event backbone in a ( Consistent) eventually correct order. 
    * This allows for recovery of any failed service by rebuilding it in "eventually correct" order.
    
## Specific application to Container Shipment example   
In this section we discuss how the generic steps introduced above can be applied for the Container shipping example 
### Step1 - context and scope for demonstration build
An initial scoping decision is that the demonstration will address shipment orders and shipment progress initiated by the "manufacturer" of the goods with the shipment company. In the context of the example there is also discussion of manufacturer and retailer reaching some agreement on the goods to be delivered but this is not part of the demonstrated capabilities. 

The Event Storming analysis of the shipment problem was end-to-end and involved many aggregates including: Orders, Voyages, Trucking operations both at the source (maufacturer pickup )  and destination (retailer delivery), Customs and export interactions, Container loading into ship at source port and unloading from ship at destination port, containers and fleet of ships. To have a simple initial demonstration build showing the role of EDA architecture and event coupled microservices, as an initial step towards development of a more complete system using agile incremental development and deployment, the initial demonstration build makes the following simplifications and scoping decisions:   
*   This build will have no implementation of:  Trucking operations, Customs and export, or Dockside Handling aggregates 
*   It will show a full lifecyle for a manufacturer user to place an order for shipment, seeing a filled container placed on board ship transported to the destination port and delivered.  
*   It will include a simulation  Service for ship movements - tracking the movement of ships carrying containers 
*   It will include simulation and analytics for  Container temperatures  in while onboard ship  
*   It will provide a query for a user to track an order and the current location and state of the associated shipment

Based on the scope selection above, active aggregates in the build will be:
* Orders  - with support for a complete order lifecycle 
* Voyages  - list of planned port to port passges with dates and manifests for each sip 
* Containers - with allocation of a container to each order and temperature tracking of refrigerated containers 
* Ships - with tracking of current voyage and current geographical position of each container ship 

The event backbone will be configured with a topic for each of the above aggregated. We expect to see multiple event typs on each topic, but subscriptions and sequencing of events will be within these high level topics. 
Command API.s will be provided to: 
* place a new shipment order 
* track an existing order, eith to confirmits booking state or to resolve the actual location and status of the container in transit 
* modify an order request which could not be booked within the requested time window 

A more complete and complex build could include an api for a shipping company person to optimally and manually assign orders to voyages, but for this initial demonstration we will automate this process and assign orders automatilly to the first voyage found meeting the requested requirements.  Specifically, each order is assigned to the first located voyage:
*  going from the port nearest to  pickup location
*  to  the port nearest  the delivery location, 
*  within the requested time window  for pickup and delivery 
*  with available capacity for an additional container on that voyage.
 
Additional APIwill be need:
* to initiate the overall demonstration 
* to manage and view specific simulation component - container simulation and analytics abd ship simulation and analytics. 

### Shipment order lifecycle and state change events 

The scoping decisions for the demonstration build listed above are reflected in a shipment order life cycle diagram shown below.

<img src="order-life-cycle.png" height="630px">

A shipment order is initially created with an API call made by a manufacturer. The order request specifies: 
*  the pickup location where  emptry container will be loaded 
*  the delivery location where the container is to be delivered to (we expect this to be in a remote country requiring a sea voyage ) 
*  the shipment time window i.e. 
   *  earliest date at which goods are available at pickup location for loading into the container 
   *  date by which delivery to the destination address is required 
Since our initial demonstration build expects to show refrigeration behavior snd track preservation of a cold chain, we asume that orders are for some commodity which requires refrigeration during its shipment.    
   
A graphical view of this API with some additional field specification is provided in [Create order Request](./createOrderApi.png) . 

When a new shipment order is placed, the shipping company must determine whether there is available capacity in some planned ship voyage which meets all the requirements specified by the manufacturer / customer. If there is a planned voyage with available cpacity for ne additional container going from the source port nearest the pickup location to the destination port nearest to the delivery location then the order can transition to state=BOOKED and positive confirmation of the order returned to the requester.  If no such voyage is available then the shipment order transitions to state=REJECTED(No Availability) and this is reported back to the requester. 

Once an order is BOOKED, then the expected dates and locations where for which a container will be needed are known. A request can be issued to book a specific (refrigerated) container for use with this shipment. We assume that the shipping company always has enough container available to meet expected shipment demand, hence the shipment order will transition to state=CONTAINER_ALLOCATED when this container booking is received. 

Since the scope for this demonstration build excliuded the simulation of trucking operations to get the goods from the manufacturer's pickup location, export clearance and actual dockside loading operations, once an order has a container allocated it is " ready to go" and transitions to state=FULL_CONTAINER_VOYAGE_READY.  The actual event of recording the container as being on board ship and at sea will not happen until simulated time in the demonstration reaches the scheduled start of the voyage on which that container is booked and the container ship assigned to that voyage is in the source port and also ready to go. At that point in simulated time, the state of the shipment order changes from state = FULL_CONTAINER_VOYAGE_READY  to state = CONTAINER_ON_SHIP.

While the order has state = CONTAINER_ON_SHIP, then we will be receiving temperature information from the COntainer simulation and analytics and Ship position information from the ship simulation service. Both provide a continuous streaming souces of information which should be considered part of the extended shipment state. 

After some period of simulated time, the ship will reach the destination port of the voyage. at this time the Oder transitions to state = CONTAINER_OFF_SHIP since our scope excluded simulation of actual dockside unloading information. Since we are not modelling customs clearance or trucking operations, there are no further events to be modelled  until the order state = CONTAINER_DELIVERED. 

Since we are not modelling invoicing and billing operations the Container can be deallocated from this order and retruned to some pool of free containers. When that has occurred the oder state can be considered state = ORDER_COMPLETED. 

We have described the the mornal, exception-free path first. There are two exception cases modelled. 
* At the time a new shipment order is requested, there may be no voyage with available capacity meeting the location and time requirements of the request. When this occurs, the manufacturer/user is informed and the order state becomes state= REJECTED (No Availability). At this point the user can modify the order with a second API requests changing dates or possibly locations. This retry request could still fail returning the order back to state = REJECTED ( No availability). Alternatively the changes in dates and location could be anough for an available voyage to be found. When this occurs the order will transition to state = BOOKED modified. 
    * If an API call to modify an order is made and the order is in some state different from state=REJECTED(No availability), we reject the API request. There could be race conditions, the order is in the process of being assigned to a voyage, or  complex recovery issues, -  what if the order is already in a container and at sea when a modify order is received ?  Full treatment of these complex business specific issues is  out of scope and avoided by the state check in the modify order call API call
* We also model the exception condition when the refrigeration unit in a container fails or is misset or over loaded. If the temperature in the container goes outside the service level rance for that shipment the goods must be considered spoiled.  The oreder will transition from state = CONTAINER_ON_SHIP to  state = ORDER_SPOILED(Temperature out of Range). Some complex business recovery such as compensating the customer and possibly scheduling a replcement shipment may be required. The details will be contract specific and outside the scope , but we do include the use of Streaming event container analytics to detect the spoilage and use rule based real-time /edge adjustments of the refrigeration gear to avoid spoilage in the demonstration simulation.   

### Step 2 -  microservices and microservice owned data for demonstration build
In this step we fix the specific microservices for each aggregate and te data organization for each microservice.
#### Orders Aggregate
For Orders we will need an orders-command-ms which will maintain a list of all current active orders and the current state of each order. The order state will as described above.  The collection of active orders will be keyed by orderID. The orders-command-ms will offer APIs for create order and modify order since these are external interactions. 

It makes sense to use CQRS and separate out order tracking into a separate oders-query-ms since: 
*  The demand for order tracking might have significantly more intense scalability needs than order commands 
    *   orders are typically created once and changes state a handful of times;  there could be many different users querying status of a particular orders independently and each requesting tracking multiple time  for each order to determine if there is some delay expected 
*  Order state tracking information should probably be organized by requesting customer NOT bu order ID 
    * since customers should be ollowed to see status on their own orders but not on other customer's orders  
    * when the shipping company is tracking an order it is most frequently doing so on behalf of a specific customer
With this approach orders-query-ms becomes a CQRS  query service with internal state updated from the event backbone, and an order tracking API 

#### Voyages Aggregate 
For Voyages we will need a voyages-command-ms which will maintain a list of all voyages and their current state. In any given run of the demonstration we will work with a fixed set of voyages - effectively the schedule for the container fleet - so there is no need for an API t create additional voyages. The voyage definition will be read from file when the build is initializing. We expect this voyage data to be well formed:
* each voyage has a container ship in the fleet allocated to make the voyage 
* the voyages assigned to any one ship are properly "chained".  For the sequence of voyages assigned to any one container ship, the destination port of the nth voyage is always the start port of the (n+1)th voyage 

The states of a yoyage are:
*  SCHEDULED   - in this state it can accept order bookings, knows how much free space is available for additional bookings, and knows the orderIDs of each shipment already booked on the voyage 
*  IN_PROGRESS -  in this state it includes a manifest  a list of the orderIDs and containerIDs on board the ship 
*  COMPLETED    - a voyage in the completed state supports tracing continers, may know which containers in the voyage were spoiled etc 

It will be helpful for the voyage-command-ms to include a query service to lookup voyages with a particular source port and destination port in a particular time windaw. This will help process booking request event but does not need to be an external API hence there is no strong argument for realizing this as a separate CQRS query service. 

#### Containers Aggregate
For Containers we will need we will use a containers-command-ms to maintain a list of defined containerIDs and track the state of each container. A fixed set of valid container IDs will be initialized at demonstration start time. As noted previously we will assume this to be enough for all requested orders to be assigned a container without availability issues. Since the collection of containers is fixed the component will not need a cmmand API

The container current state maintained in container-command-ms is:
*  state = FREE     - this container is not in use and is available to be assigned to a new shipment order 
*  state = ALLOCATED - thei container is allocated ot order orderID  and potentially in use for that shipment   

We will be modelling and performing streaming analytics on temperature inside a (refrigerated) container. Hence there will be a separate services performing this streaming analytics and simulation:  container-streaming-svc.  
Conceptually, while a container is ALLOCATED to a shipment order with state = CONTAINER_ON_SHIP, its internal temperature and power usage will be maintained as streaming state by the container-streaming-svc. 

#### Fleet/Ships Aggregate

For Ships we wil have a monolithic fleet simulation service providing continuous simulation of ship position for each ship and modelling of ship events. 
This service will include a UI to enable viewing the positions and states of the ships.
It may have a separate UI to control the overall demonstration.
There is no requirement for any separate microservice maintining additional information on ship state.

### Step3 - specifing all interactions in a logic flow for the demonstration build
Using the understanding of the event flow from the Event Storming session, the scoping of this build, the list of microservices and data within each microservices developed in the steps above, we can write out in a complete interrraction flow. This flow illustrates how the microservices are linked together via the Event backbone using event interractions for all non API interractions between distinct microservices. 

#### Command microservice interactions - order create through voyage start with container on board
The diagram below shows all command interactions from initial order creation through voyage start. 

<img src="interactions1.png" height="630px">

The grey(shaded) columns of processing blocks are organized to show processing by the different command microservices.
*  Column 1 shows processby the orders-command-ms
*  Column 2 shows processing by the voyages-command-ms
*  Column 3 shows processing by the containers-command-ms and in a later figure by containers-streaming-ms
*  Column 4 shows processing by the fleet/ships-simulator-ms

Comments on steps in the command flow:
*  A new shipment order request is initiated with the syncronous createOrder API at top left 
   *   the orders-command-ms will create a new order record in its tale of active orders and populate it with order details
   *   a *NewOrder* event is emitted on the Orders Topic 
   *   the generated  orderID  or the new shipment order is returned to the requester in the createOrder response. This enables the requester to query the status of an order and possibly modify the parameters of an unbooked order.  
 *  the voyages-command-ms subscibes to all newOrder events on the Orders topic and tries to assign each new order to an available voyage 
   *  this operation is simplified by internally maintainin some list of vayages organized by port pait ( Starting port - ending port combination) and by time within port pair.
   *  using such a list each voyage matching the port pair requirement of the new order can be checked or available capacity
   *  if a voyage meeting all requirements for the new order is found, a booking event is emitted; if not, a rejected(No availability) event is emitted 
   *  a booked event causes state change in both the voyage - available capacity reduced, new order added to bookings - and to the order. We choose to make both booking and rejected (no Availabiity) events on the Orders topic rather than the Voyages topic
*  the orders-command-ms subscribes to *Orders: booking*  and to *Orders: Rejected(no availability)* events and updates the current state of the affected order with the received information.
   *  for bookings, the current state of order is updated with the booking informationg including VoyageID and now specific pickup and delivery expected dates
   * a rejected order has its state updated to rejected. This enables the requester to modify the order, suggesting different required dates or locations and trigerring a new search for a voyage meeting the modified requirements.  
   *  booked orders now have a specific schedule from the booked voyage of when they will need a container allocated for their use 
   *  A  *Containers: needEmpty* event is emitted to get a specific container allocated for use by the booked shipment
*  The containers-comand-ms subscribes to  *Containers: needEmpty* events and allocates an available container for each one
   *  This microservice is maintaining a list of all containers and their current states 
   *  For each incoming needEmpty event, it assigns a free container to that order and emits an *Orders: allocatedContainer* event specifying the containerID of the allocated container. 
   *  It is very natural/necessary for the allocation of a container to be reported as an asynchronous event since this may occur at any time before the container is needed, possibly significanly later that he Containers:needEmpty event occurs 
   *  We make  *Orders: allocatedContainer* an event on the Orders topic since that is the most significant state change which it drives.  
*  The orders-command-ms subscribes to all*Orders: allocatedContainer* events and updates the order current state with its allocated containerID   
   *  Once an rder is booked on a voyage and has a container allocated for it to use, the actual physical process of shipment canbegin at this point.
   *  Since the delivery of empty container, loading it with goods at the pick up site, truck operations to get it to dockside etc are out of scope for this build, we can consider the container ready for its voyage at this point. Hence the *Voyages:fullContainerReady* event is emitted at this point by the orders-command-ms. This event includes the containerID  of the allocated container. 
*  The voyages-command-ms subscribes to *Voyages: fullContainerReady* events an uses these to construct a complete manifest -  the list of  <containerID, orderID> pairs which will travel on this voyage 
*  At this point the voyage-command-ms interacts with the fleet/ships-simulation-ms to simulate start of voyage 
  *  we have shown this in the figure as a syncronous call to getNextVoyageInfo . This oul also be handled with one or more event interactions 
  *  the ship-simulator-ms will update the state of this ship to show the available containers and orders on board
  *  it will start the simulation of the ship moving on its course tocomplete the vogage
  *  the ship-simulator-ms willemit a *Voyages: ShipStartedVoyage*  event 
* the Voyages-command-ms receives this event and for each order/container in the manifest emits an *Orders: ContainerOnShip* event
* the orders-command-ms will subscribe to *Orders: ContainerOnShip* events and update the current state of each identified order with this information.

#### Command microservice interaction - container on ship at sea through shipment complete
The diagram below shows all command interactions from container on ship in voyage through shipment delivered and order completed. 

<img src="interactions2.png" height="630px">
As in the previous interaction diagram, the columns with grey/shaded processing blocks show work by (1) orders-command-ms (2) voyages-command-ms (3) containers-command-ms and containers-streaming-ms (4) fleet/ships-simulator service respectively.

This diagram starts with containers on board a ship which is sailing on specific voyage and is at sea. 
*  The fleet/ships-simulator-ms repeatedly simulated movement of the ship along its course 
   * It t emits *Ships: GPSposition* events recording the position of the ship at different points in simulated time. 
*  Similarly, while the ship is at sea, the contaner-streams-svc is continualy simulating temperature within the container and edge monitoring to adjust controls if necessary and to report a cold chain breach in that container if it occurs. 
   *  This will result in a repeated stream of *Containers: tempAndGpsState* events reporting the temperature, GPS coordinates and possibly power consumption of the container
   *  There could also be on or more *Containers: action*  events to adjust or reset controls of the refrigeration unit in the container
   *  These adjustment event are initiated by predictive real-ime analytics on the cntainer state 
   *  If the temperature in the container goes out of range and there is a cold chain failure, a Containers: temperature Out of Range event is emitted
*  After some period  of simulated time tracked by these ship position and container state repeated events, the ship will be simulated as arriving at the destination port of the voyage. 
   *  The ship-simulator-ms emits a *Voyages: ShipEndedVoyage* event  
*  The voyages-command-ms subscribes to *Voyages: ShipEndedVoyage* and for each such event, emits *Orders: containerOffShip*
   *  It can do this because the current state record for each voyage includes the manifest of <orderID, containerID> pairs which travelled on that voyage 
   * the current state of the voyage is updated to COMPLETED
*  The orders-command-ms subscribes to *Orders: containerOffShip* and updates the the state of all orders which have completed their shipping leg as a result of completion of their booked voyage
   *  Now, since simulation of the dockside unloading, customs processes, trucking operation to support deliver are out of scope for this build, we can consider the shipment delivered at this point 
   *  orders-command-ms emits *Orders: containerDelivered* and marks this as currnet state of container 
   *  With the shipment delivered, there is no further need for a container to be associated with this order; orders-command-ms emits *Containers: containerReleased*
*  The containers-command-ms subscribes to *Containers: cntainerReleased*  and marks the ciurrent state of the identified container as FREE and available to be allocated to other shipment orders 
*  The order-command-ms considers process of the shipmentorder complete at this point 
   *  It emits *Orders: orderComplete* and marks this as the current state of the order 
   *  A more complete and realistic build would statr invoicing and billing event at this poitn , but this was decided to be out of scope at this point 
*  The fleet/ships-simulator-ms will continue at this point to start the next voyage in its planned itenerary and interact with voyages-command-ms to do this 
   *  this is a cycled repetition of start of voyage interaction discussed previously 
   

#### Query microservice service  - CQRS Order and  Shipment tracking microservices 
The diagram below shows all interactions with the shipment tracking microservice. This microservice subscribes to may events  carrying required information and supports one or more query APIs for different flavors of order and shipment tracking 

<img src="interactions3.png" height="630px">

There could be multiple flavors of orderand shipment tracking query APIs supported:
* Order confirmation query could address orders, bookings, rejections, modified orders etc 
* Shipment state query could cover: container assignment, on board ship, ship position, off ship, delivery, etc 
* Cold chain certification query could want to augment the above with a full temperature log of the container while in transit and expect reporting on temperature range violations. 

Since we are using a CQRS approach, and all queries are non state changing, we could combine these multiple query levels into a single microservice or separate them out into separate microservices. If query load is intense there could be multiple instances of each such query microservices with load balancing of user requests. 

The design of these different flavors query services is essentially the same.  The internal state data to respond to queries is obtained by subscribing to the necessary Topics. Fofulel cold chain and shipment reporting, this will involve all four topics Orders, Voyages, Containers and Ships.  Internally the data will be organized (1) by requester of the order, then by orderID, then current state and possibly summaries of repeated event history. 

The inteaction digram 3 above illustrates this organization. For any order and shipment tracking query service there are synchronous APIs offered at one side and subscribed events received at the other to gather required state information from the vent backbone.  

#### Topics, event types and the event emit and consumption lists

From the interaction diagrams we can compile  a list of all event types which will occur in the build and check that they are organized into topics in a way which preserves all essential event sequencing. 

The diagram below lists the event types and topics, showing emitters ( publishers) and consumers ( subscribers) of each event type. 

<img src="topicsAndEvents.png" height="630px">

### Step4 -  data recovery considerations for this demonstration build
At this point the pattern for data recovery after a microservice failure is understood in principle, but specific recovery demonstration after a failure is out of scope at this point. 