Luentojen linkitettynä, luentojen kohokohdat:

- [vk1-1](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20intro.pdf)
    - single- / multiprocess{es,ors}
    - batch / time sharing
    - things about OS, design requirements
    - kernel vs OS, monolithic vs micro kernel 

- [vk1-2: processes](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20processes.pdf)
    - process image, process control block
    - process execution, suspending, five state model
    - how OS keeps track of processes
    - how OS switches processes
    - execution mode (`(un)priviliged`) change

- [vk2-1: threads](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20threads.pdf?time=1705914526188)
    - advantages, uses of threads
    - user/kernel level differences, properties
    - thread synchronization
    - Amdahl's law
        - gets relative speedup depending on how `serial` a software is

- [vk2-2: scheduling](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20scheduling1.pdf)
    - short-, medium-, long-term scheduling
    - CPU- / IO-bound processes
    - scheduling algorithms with examples
        - First Come First Served
        - Shortest Job First
        - Round Robin

- [vk2-3: advanced scheduling](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20scheduling2.pdf)
    - priority scheduling
    - multilevel feedback queue
    - fair share scheduling
    - lottery scheduling
    - scheduling in multiprocessor systems
        - sync (thread) granularity
        - load balancing
        - cache affinity
        - single vs multi queue scheduling
        - thread scheduling (single, gang, dynamic)

- [vk3-1: virtual mem](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20virtual%20memory1.pdf)
    - how OS sees memory
    - address translation 
        - virtual vs physical
        - example (base + relative + bounds registers)
        - both HW and SF support required
        - segmentation
        - memory swapping
            - frames, pages
            - paging in detail
            - inverted page table
            - translation lookaside buffer TLB
        - combined segmentation and paging

- [vk3-2: virtual mem policies, algorithms](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20virtual%20memory2.pdf?time=1706778669413)
    - best-fit, first-fit, next-fit
    - buddy system
    - external vs internal segmentation
    - mem paging in detail
        - page fault
        - blocking state
        - page tables present- / modify bit
        - trashing
            - principles
        - fetch, placement, replacement policies
        - replacement algorithms
            - First-In-First-Out, Least-Recently-Used, Clock (policy?)

- [vk4-1: VMs, containers](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing%20Environments%20-%20Virtualization.pdf)
    - VMs summary
    - hypervisor types
        - type 1 vs type 2 diff
    - paravirtualization
    - VM tools, orchestration, etc
    - containers (in detail?)
    - VMs vs containers
    - container orchestration, etc
    - Kubernetes

- [vk4-2: cloud computing](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing%20Platforms%20-%20Cloud%20Computing.pdf)
    - service models: IaaS, PaaS, SaaS
    - serverless computing
    - deployment models: public/private/hybrid/community?
    - cloud management, scalability, etc
    - cloud pricing models
    - cloud security

- [vk5-1: Inter-Process Communication](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Lecture7_InterprocessCommunication_IPC.pdf)
    - types of communication
        - shared memory
        - message passing
        - Remote Procedure Call / Remote Method Invocation
        - signals
        - (named) pipes
            - FIFO
        - files
            - memory mapped files
        - sockets
        - message queues
    - sync vs async
    - blocking vs non-blocking

- [vk5-2: concurrency](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20concurrency1.pdf)
    - race condition
    - concurrency
    - deadlock
    - starvation
    - MUTual EXclusion
    - critical section
    - locks and conditions
    - (in)finitie buffer

- [vk6-1: more concurrency](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20concurrency2.pdf)
    - atomicity
    - readers/writers examples
    - deadlock conditions, example, prevention, detection, avoidance

- [vk6-2: I/O and file systems](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20file%20systems.pdf)
    - differences in I/O devices
    - programmed I/O, interrupt-driven I/O, Direct Memory Access
    - HDD example
    - SSD example
        - Flash Transition Layer
        - wear leveling
        - write amplification
    - directories
    - operations on files and dirs
    - filesystem implementation
        - inodes, inode table
        - free list, bitmap, superblock
        - multilevel indeces
        - file reading/writing examples
        - caching, buffering

- [vk7-1: security](https://moodle.helsinki.fi/pluginfile.php/5525217/course/section/759549/Computing-platforms%20-%20security.pdf)
    - GDPR?
    - laws, regulations, ethics
    - malware
    - vulnerabilities
    - buffer overflow
    - firewalls
    - intrusion detection
    - authentication
        - biometric, MFA
        - access control
        - access control list
        - capability list
        - backup, archive
