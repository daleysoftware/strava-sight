# Design

The following document outlines the high-level design of this platform.

## Flow diagram

Interaction between Golang, JavaScript and MySQL.

TODO remove web socket and add a descriptiona bout the job queue.

                +-----------+
          +-----| Job Queue |<----+
          |     +-----------+     |
          v                       v
    +-----------+             +-------+
    | WS server |<----+       | MySQL |
    +-----------+     |       +-------+
          |           |           ^
          |           |           |
          |           |           v
          |           |     +-----------+
          |           +-----| REST srvc |
          |                 +-----------+
          |                       ^
    BE    |                       |
    ======|=======================|======
    FE    |                       |
          +------------ ----------+
                      | |
                      v v
                  +---------+
            +---->| Actions |-----+
            |     +---------+     |
            |                     v
        +-------+           +----------+
        | Views |           | Dispatch |
        +-------+           +----------+
            ^                     |
            |     +--------+      |
            +-----| Stores |<-----+
                  +--------+
